import React, { useState } from "react";
import { CloudRain, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import WorldMap from "../components/worldmap"; // Import the new WorldMap component

export default function WeatherWise() {
  const [selectedDate, setSelectedDate] = useState<number>(14);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "Very Wet",
  ]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, 6)); // July 2024
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Create a full date object from state for display
  const fullSelectedDate = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    selectedDate
  );
  const formattedDate = fullSelectedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  const getDaysInMonth = (
    date: Date
  ): { firstDay: number; daysInMonth: number } => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const renderCalendar = (): React.ReactElement[] => {
    const days: React.ReactElement[] = [];
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      0
    );
    const prevMonthTotal = prevMonth.getDate();
    for (let i = prevMonthDays; i > 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="flex items-center justify-center h-8 text-gray-600 text-xs"
        >
          {prevMonthTotal - i + 1}
        </div>
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      const isHighlighted = false;
      days.push(
        <button
          key={day}
          onClick={() => {
            setSelectedDate(day);
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
          className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all transform ${
            isSelected
              ? "bg-blue-600 text-white font-semibold scale-110 shadow-lg shadow-blue-500/50"
              : isHighlighted
              ? "bg-blue-600/80 text-white font-semibold hover:bg-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
              : "text-gray-300 hover:bg-gray-700 hover:scale-105 hover:text-white"
          }`}
        >
          {day}
        </button>
      );
    }
    const totalCells = days.length;
    const remainingCells = 35 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="flex items-center justify-center h-8 text-gray-600 text-xs"
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

      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <CloudRain className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">WeatherWise</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-gray-300 hover:text-white transition">
            Home
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition">
            Dashboard
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition">
            Map
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full"></div>
        </div>
      </header>

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
          <WorldMap />

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

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Weather Condition Filters
          </h3>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  selectedFilters.includes(filter)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30">
            Get Weather Probability
          </button>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-400 text-sm border-t border-gray-800 mt-12">
        © 2024 WeatherWise. Powered by NASA Data. All rights reserved.
      </footer>
    </div>
  );
}
