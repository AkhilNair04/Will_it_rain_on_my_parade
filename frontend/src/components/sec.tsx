import React, { useState } from "react";
import { CloudRain, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorldMap from "../components/worldmap"; // Import the new WorldMap component

export default function WeatherWise() {
  const navigate = useNavigate();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate()); // Default to today's date
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "Very Wet",
  ]);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth())
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'error' | 'warning' | 'success' | 'info';
  } | null>(null);

  // Location state
  const [locationData, setLocationData] = useState<{
    city: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  // Weather API state
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Create a full date object from state for display
  const fullSelectedDate = selectedDate ? new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    selectedDate
  ) : null;
  const formattedDate = fullSelectedDate ? fullSelectedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : null;

  const filters: string[] = [
    "Very Hot",
    "Very Cold",
    "Very Wet",
    "Very Windy",
    "Very Uncomfortable",
  ];

  const toggleFilter = (filter: string): void => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  // Handle location updates from WorldMap component
  const handleLocationUpdate = (
    city: string,
    latitude: number,
    longitude: number
  ) => {
    setLocationData({ city, latitude, longitude });
    // Clear any previous errors
    setWeatherError(null);
    // Don't show notification - the permanent location indicator below is enough
    console.log("📍 [LOCATION UPDATE] Location updated:", {
      city,
      latitude,
      longitude,
    });
  };

  const getDaysInMonth = (
    date: Date
  ): { firstDay: number; daysInMonth: number } => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sunday, 1=Monday, etc.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Debug: Let's verify October 2025 - 1st should be Wednesday (3)
    const firstDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][firstDay];
    console.log(`📅 [CALENDAR] ${year}-${month + 1}: First day is ${firstDayName} (${firstDay}), ${daysInMonth} days total`);
    
    // October 1, 2025 is a Wednesday (day 3), so October 5 should be on Saturday (day 6)
    return { firstDay, daysInMonth };
  };

  // Function to get weather probability
  const getWeatherProbability = async () => {
    console.log("🌦️ [WEATHER] Getting weather probability...");
    console.log("📍 [LOCATION] Current location data:", locationData);
    console.log("📅 [DATE] Selected date:", selectedDate);
    console.log("📅 [DATE] Current month:", currentMonth);

    // Clear previous notifications
    setNotification(null);
    setWeatherError(null);

    // Validate location data
    if (!locationData) {
      const errorMessage = "📍 Please select a location on the map first. Click on the map or search for a city.";
      setWeatherError(errorMessage);
      setNotification({
        message: "Location Required: Please select a location on the map before getting weather data.",
        type: 'warning'
      });
      return;
    }

    // Check if selected date is in the past (except today)
    // Use selectedDate with fallback to today's date
    const currentSelectedDate = selectedDate || today.getDate();
    const selectedFullDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      currentSelectedDate
    );
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    console.log(`🔍 [DATE VALIDATION] Selected: ${selectedFullDate.toDateString()}`);
    console.log(`🔍 [DATE VALIDATION] Today: ${todayStart.toDateString()}`);
    console.log(`🔍 [DATE VALIDATION] Is past date? ${selectedFullDate < todayStart}`);
    
    if (selectedFullDate < todayStart) {
      const errorMessage = "📅 Past dates not supported: Please select today's date or a future date.";
      setWeatherError(errorMessage);
      setNotification({
        message: `❌ Cannot predict weather for past dates. Selected: ${selectedFullDate.toLocaleDateString()}. Please choose today or a future date.`,
        type: 'error'
      });
      return;
    }

    setWeatherLoading(true);
    setWeatherError(null);

    try {
      // Format the selected date to YYYY-MM-DD
      // Use currentSelectedDate with fallback to today's date
      const currentSelectedDate = selectedDate || today.getDate();
      
      // Create date object using current month/year and selected day
      const selectedFullDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        currentSelectedDate
      );
      
      // Debug logging
      console.log("🌤️ [WEATHER API] Date calculation debug:");
      console.log("   - selectedDate:", selectedDate);
      console.log("   - currentSelectedDate:", currentSelectedDate);
      console.log("   - currentMonth:", currentMonth);
      console.log("   - selectedFullDate:", selectedFullDate);
      console.log("   - selectedFullDate.toDateString():", selectedFullDate.toDateString());
      
      // Use manual date formatting to avoid timezone issues
      const year = selectedFullDate.getFullYear();
      const month = String(selectedFullDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedFullDate.getDate()).padStart(2, '0');
      const forecastDate = `${year}-${month}-${day}`;
      
      console.log("   - Manual formatted date:", forecastDate);
      console.log("   - toISOString formatted:", selectedFullDate.toISOString().split("T")[0]);

      // Default time range (can be made configurable later)
      const start_hour = 7; // 7 AM
      const end_hour = 19; // 7 PM

      const requestData = {
        city: locationData.city,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        forecast_date: forecastDate,
        start_hour,
        end_hour,
      };

      console.log("🌤️ [WEATHER API] Making weather request:");
      console.log("   - Request data:", requestData);

      const response = await fetch("http://localhost:5000/api/weather/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("📡 [WEATHER API] Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
      setWeatherLoading(false);

      console.log("✅ [WEATHER API] Weather data received:");
      console.log(data);

      // Navigate to the result dashboard with weather data as URL parameters
      const queryParams = new URLSearchParams({
        weatherData: JSON.stringify(data),
        location: JSON.stringify(locationData),
        date: forecastDate,
      });

      navigate(`/dashboardresult?${queryParams.toString()}`);

      console.log("🧭 [NAVIGATION] Redirecting to dashboard with weather data");
    } catch (error) {
      setWeatherLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setWeatherError(errorMessage);

      console.error("❌ [WEATHER API] Error:", errorMessage);
      console.error("❌ [WEATHER API] Full error:", error);

      alert(`Error fetching weather data: ${errorMessage}`);
    }
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const renderCalendar = (): React.ReactElement[] => {
    const days: React.ReactElement[] = [];
    
    // firstDay is 0 for Sunday, 1 for Monday, etc.
    // We need to add empty cells for the days from previous month
    const prevMonthDays = firstDay; // This is correct - firstDay tells us how many empty cells to add at the beginning
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      0  // Get last day of previous month
    );
    const prevMonthTotal = prevMonth.getDate();
    
    console.log(`📅 [CALENDAR DEBUG] Month: ${currentMonth.getMonth() + 1}/${currentMonth.getFullYear()}`);
    console.log(`📅 [CALENDAR DEBUG] First day: ${firstDay} (${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][firstDay]})`);
    console.log(`📅 [CALENDAR DEBUG] Adding ${prevMonthDays} cells from previous month`);
    
    // Add previous month's trailing days
    for (let i = prevMonthDays; i > 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="flex items-center justify-center h-8 text-gray-500 text-xs opacity-50"
        >
          {prevMonthTotal - i + 1}
        </div>
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      const isHighlighted = false;
      
      // Check if this is today's date
      const isToday = currentMonth.getFullYear() === today.getFullYear() &&
                      currentMonth.getMonth() === today.getMonth() &&
                      day === today.getDate();

      days.push(
        <button
          key={day}
          onClick={() => {
            setSelectedDate(day);
            // Clear any notifications when date is selected
            setNotification(null);
            setWeatherError(null);
            
            // Create the correct date object - this was the bug!
            const selectedFullDate = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              day
            );
            
            console.log(
              "📅 Date Selected:",
              selectedFullDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })
            );
            console.log("📅 ISO Date:", selectedFullDate.toISOString());
            console.log("📅 Raw Date Object:", selectedFullDate);
          }}
          className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all transform hover:scale-105 ${
            isSelected
              ? "bg-blue-600 text-white font-semibold scale-110 shadow-lg shadow-blue-500/50 ring-2 ring-blue-400"
              : isToday
              ? "bg-green-600 text-white font-semibold ring-2 ring-green-400 hover:bg-green-500"
              : isHighlighted
              ? "bg-blue-600/80 text-white font-semibold hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          {day}
        </button>
      );
    }
    
    // Add next month's leading days to complete the calendar grid
    const totalCells = days.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 total cells
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="flex items-center justify-center h-8 text-gray-500 text-xs opacity-50"
        >
          {i}
        </div>
      );
    }
    return days;
  };

  const previousMonth = (): void =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  const nextMonth = (): void =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  const setMonth = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month));
    setShowDatePicker(false);
  };
  const setYear = (year: number) =>
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* All background animation elements */}
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(-20px) translateX(10px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(20px) translateX(-10px); } }
        @keyframes satellite { 0% { transform: translateX(-100px) translateY(0); } 100% { transform: translateX(calc(100vw + 100px)) translateY(-50px); } }
        @keyframes meteor { 0% { transform: translateX(0) translateY(0); opacity: 1; } 100% { transform: translateX(-200px) translateY(200px); opacity: 0; } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-satellite { animation: satellite 30s linear infinite; }
        .animate-meteor { animation: meteor 2s linear infinite; box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8); }
        .leaflet-container { background-color: #1e3a5f; }
      `}</style>

     

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Plan Your Perfect Day</h1>
          <p className="text-gray-400 text-lg">
            NASA-powered weather probability for your outdoor activities.
          </p>
          <p className="text-blue-400 text-xl mt-4 font-semibold">
            {formattedDate}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Map Section is now cleaner and uses the dedicated component */}
          <WorldMap onLocationUpdate={handleLocationUpdate} />

          {/* Calendar */}
          <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="text-base font-semibold hover:text-blue-400 transition flex items-center gap-2"
                >
                  {monthName}
                  <Calendar className="w-4 h-4" />
                </button>
                {showDatePicker && (
                  <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl z-20 min-w-[250px]">
                    <div className="mb-3">
                      <label className="text-xs text-gray-400 mb-1 block">
                        Year
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setYear(currentYear - 1)}
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={currentYear}
                          onChange={(e) => setYear(parseInt(e.target.value))}
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-center focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => setYear(currentYear + 1)}
                          className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">
                        Month
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {months.map((month, index) => (
                          <button
                            key={month}
                            onClick={() => setMonth(index)}
                            className={`px-2 py-1 text-xs rounded transition ${
                              index === currentMonthIndex
                                ? "bg-blue-600 text-white"
                                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                            }`}
                          >
                            {month.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center text-gray-400 text-xs font-semibold h-8"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Notification Component */}
          {notification && (
            <div className={`max-w-md p-4 rounded-lg border text-sm text-center transition-all duration-300 ${
              notification.type === 'error' ? 'bg-red-900/30 border-red-600 text-red-300' :
              notification.type === 'warning' ? 'bg-yellow-900/30 border-yellow-600 text-yellow-300' :
              notification.type === 'success' ? 'bg-green-900/30 border-green-600 text-green-300' :
              'bg-blue-900/30 border-blue-600 text-blue-300'
            }`}>
              <div className="flex items-center justify-between">
                <span>{notification.message}</span>
                <button 
                  onClick={() => setNotification(null)}
                  className="ml-2 text-xs opacity-70 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <button
            onClick={getWeatherProbability}
            disabled={weatherLoading}
            className={`font-semibold px-8 py-3.5 rounded-xl transition shadow-lg ${
              weatherLoading
                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:scale-105"
            }`}
          >
            {weatherLoading
              ? "Getting Weather Data..."
              : "Get Weather Probability"}
          </button>

          {/* Current Date and Selected Date Display */}
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-400">
              📅 Today: {today.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {selectedDate && (
              <p className="text-xs text-blue-400">
                🎯 Selected: {new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  selectedDate
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {/* Location indicator */}
          {locationData && (
            <p className="text-sm text-green-400">
              📍 Location: {locationData.city} (
              {locationData.latitude.toFixed(4)},{" "}
              {locationData.longitude.toFixed(4)})
            </p>
          )}

          {/* Error display */}
          {weatherError && (
            <p className="text-sm text-red-400 max-w-md text-center">
              ❌ Error: {weatherError}
            </p>
          )}
        </div>
      </main>

      
    </div>
  );
}
