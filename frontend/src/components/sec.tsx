import React, { useState } from 'react';
import { MapPin, CloudRain, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function WeatherWise() {
  const [selectedDate, setSelectedDate] = useState<number>(14);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['Very Wet']);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, 6)); // July 2024
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filters: string[] = ['Very Hot', 'Very Cold', 'Very Wet', 'Very Windy', 'Very Uncomfortable'];

  const toggleFilter = (filter: string): void => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getDaysInMonth = (date: Date): { firstDay: number; daysInMonth: number } => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const renderCalendar = (): React.ReactElement[] => {
    const days: React.ReactElement[] = [];
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    const prevMonthTotal = prevMonth.getDate();

    // Previous month days
    for (let i = prevMonthDays; i > 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="flex items-center justify-center h-8 text-gray-600 text-xs">
          {prevMonthTotal - i + 1}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDate;
      const isHighlighted = day === 5 || day === 7;
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all transform ${
            isSelected
              ? 'bg-blue-600 text-white font-semibold scale-110 shadow-lg shadow-blue-500/50'
              : isHighlighted
              ? 'bg-blue-600/80 text-white font-semibold hover:bg-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30'
              : 'text-gray-300 hover:bg-gray-700 hover:scale-105 hover:text-white'
          }`}
        >
          {day}
        </button>
      );
    }

    // Next month days
    const totalCells = days.length;
    const remainingCells = 35 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="flex items-center justify-center h-8 text-gray-600 text-xs">
          {i}
        </div>
      );
    }

    return days;
  };

  const previousMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = (): void => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setMapPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const setMonth = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month));
    setShowDatePicker(false);
  };

  const setYear = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
  };

  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 text-white relative overflow-hidden">
      {/* Animated Space Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 left-60 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-40 right-40 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-64 right-80 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-40 left-40 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-60 right-60 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-20 left-60 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '3.5s' }}></div>
        
        {/* Larger twinkling stars */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-200 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-purple-200 rounded-full animate-pulse opacity-70" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating Planets/Orbs */}
        <div className="absolute top-20 right-32 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 blur-sm animate-float"></div>
        <div className="absolute bottom-32 left-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-sm animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full opacity-20 blur-sm animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Satellite/ISS */}
        <div className="absolute top-1/3 left-0 animate-satellite">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-30">
            <rect x="15" y="15" width="10" height="10" fill="white"/>
            <rect x="10" y="18" width="5" height="4" fill="white"/>
            <rect x="25" y="18" width="5" height="4" fill="white"/>
            <rect x="18" y="10" width="4" height="5" fill="white"/>
            <rect x="18" y="25" width="4" height="5" fill="white"/>
            <line x1="5" y1="20" x2="10" y2="20" stroke="white" strokeWidth="1"/>
            <line x1="30" y1="20" x2="35" y2="20" stroke="white" strokeWidth="1"/>
          </svg>
        </div>
        
        {/* Meteor/Shooting Stars */}
        <div className="absolute top-20 right-0 w-1 h-1 bg-white animate-meteor"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white animate-meteor" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/3 left-0 w-1 h-1 bg-white animate-meteor" style={{ animationDelay: '6s' }}></div>
        
        {/* Nebula Effect */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(20px) translateX(-10px);
          }
        }
        @keyframes satellite {
          0% {
            transform: translateX(-100px) translateY(0);
          }
          100% {
            transform: translateX(calc(100vw + 100px)) translateY(-50px);
          }
        }
        @keyframes meteor {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-200px) translateY(200px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-satellite {
          animation: satellite 30s linear infinite;
        }
        .animate-meteor {
          animation: meteor 2s linear infinite;
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
        }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <CloudRain className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">WeatherWise</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-gray-300 hover:text-white transition">Home</a>
          <a href="#" className="text-gray-300 hover:text-white transition">Dashboard</a>
          <a href="#" className="text-gray-300 hover:text-white transition">Map</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Plan Your Perfect Day</h1>
          <p className="text-gray-400 text-lg">NASA-powered weather probability for your outdoor activities.</p>
        </div>

        {/* Map and Calendar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Map */}
          <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700">
            <div 
              className="relative h-64 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-xl overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* World Map with Continents */}
              <svg 
                className="absolute inset-0 w-full h-full transition-transform duration-200" 
                viewBox="0 0 800 400" 
                preserveAspectRatio="xMidYMid slice"
                style={{ 
                  transform: `scale(${mapZoom}) translate(${mapPosition.x / mapZoom}px, ${mapPosition.y / mapZoom}px)`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
              >
                {/* Ocean Background */}
                <rect width="800" height="400" fill="#1e3a5f"/>
                
                {/* Continents */}
                <path d="M 150 80 Q 120 100 130 140 L 140 180 Q 160 200 180 190 L 200 170 Q 220 160 210 140 L 190 100 Q 180 80 150 80 Z" 
                      fill="#2d5f3f" opacity="0.8"/>
                <path d="M 180 100 Q 200 110 190 130 L 170 150 Q 160 140 170 120 L 180 100 Z" 
                      fill="#3d7f5f" opacity="0.7"/>
                <path d="M 220 220 Q 210 240 220 280 L 235 320 Q 245 340 255 330 L 260 300 Q 270 260 260 240 L 245 220 Q 235 215 220 220 Z" 
                      fill="#2d5f3f" opacity="0.8"/>
                <path d="M 380 100 Q 390 90 410 95 L 430 105 Q 440 115 435 130 L 420 140 Q 400 145 390 135 L 380 120 Q 375 110 380 100 Z" 
                      fill="#2d5f3f" opacity="0.8"/>
                <path d="M 400 160 Q 380 170 385 200 L 395 250 Q 410 290 430 300 L 450 295 Q 465 280 460 250 L 455 210 Q 450 180 435 170 L 415 165 Q 405 160 400 160 Z" 
                      fill="#3d7f5f" opacity="0.8"/>
                <path d="M 480 90 Q 520 80 560 90 L 600 110 Q 620 130 610 160 L 590 180 Q 570 190 550 185 L 520 170 Q 490 150 485 130 L 480 110 Q 475 100 480 90 Z" 
                      fill="#2d5f3f" opacity="0.8"/>
                <path d="M 540 160 Q 560 170 570 190 L 575 210 Q 570 230 555 235 L 535 230 Q 525 220 530 200 L 540 180 Q 540 170 540 160 Z" 
                      fill="#3d7f5f" opacity="0.7"/>
                <path d="M 620 260 Q 640 255 660 265 L 675 280 Q 680 295 670 305 L 650 310 Q 630 305 620 290 L 615 275 Q 615 265 620 260 Z" 
                      fill="#2d5f3f" opacity="0.8"/>
                <path d="M 100 360 Q 200 350 300 355 L 500 355 Q 600 350 700 360 L 700 400 L 100 400 Z" 
                      fill="#e8f4f8" opacity="0.6"/>
              </svg>
              
              {/* Location Marker - New York */}
              <div className="absolute pointer-events-none" style={{ top: '38%', left: '26%' }}>
                <div className="relative">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-xl animate-pulse"></div>
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-lg font-semibold">
                    New York
                  </div>
                  <div className="absolute top-0 left-0 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-auto">
                <button 
                  onClick={() => setMapPosition({ x: 0, y: 0 })}
                  className="bg-gray-900/90 backdrop-blur p-2.5 rounded-lg hover:bg-gray-800 transition shadow-lg hover:scale-110 transform"
                >
                  <MapPin className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleZoomIn}
                  className="bg-gray-900/90 backdrop-blur p-2.5 rounded-lg hover:bg-gray-800 transition shadow-lg hover:scale-110 transform"
                >
                  <div className="w-4 h-4 flex items-center justify-center text-sm font-bold">+</div>
                </button>
                <button 
                  onClick={handleZoomOut}
                  className="bg-gray-900/90 backdrop-blur p-2.5 rounded-lg hover:bg-gray-800 transition shadow-lg hover:scale-110 transform"
                >
                  <div className="w-4 h-4 flex items-center justify-center text-sm font-bold">−</div>
                </button>
              </div>
            </div>
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-600/50 transform hover:scale-105">
              <MapPin className="w-5 h-5" />
              Use My Location
            </button>
          </div>

          {/* Calendar */}
          <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <button onClick={previousMonth} className="p-2 hover:bg-gray-700 rounded-lg transition">
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
                      <label className="text-xs text-gray-400 mb-1 block">Year</label>
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
                      <label className="text-xs text-gray-400 mb-2 block">Month</label>
                      <div className="grid grid-cols-3 gap-2">
                        {months.map((month, index) => (
                          <button
                            key={month}
                            onClick={() => setMonth(index)}
                            className={`px-2 py-1 text-xs rounded transition ${
                              index === currentMonthIndex
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
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
              <button onClick={nextMonth} className="p-2 hover:bg-gray-700 rounded-lg transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="flex items-center justify-center text-gray-400 text-xs font-semibold h-8">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        </div>

        {/* Weather Filters */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Weather Condition Filters</h3>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                  selectedFilters.includes(filter)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Get Weather Button */}
        <div className="flex justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30">
            Get Weather Probability
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm border-t border-gray-800 mt-12">
        © 2024 WeatherWise. Powered by NASA Data. All rights reserved.
      </footer>
    </div>
  );
}