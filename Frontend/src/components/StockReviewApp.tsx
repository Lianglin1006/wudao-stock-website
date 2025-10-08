import { useState, useEffect } from 'react';
import svgPaths from '../imports/svg-3h6x01iqd1';
import imgLogo from '../assets/logo.svg';
import { mockStocks, mockSentimentData, sectorReasons, sectorDuration, Stock } from '../utils/mockData';
import { useStockData } from '../hooks/useStockData';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Star } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CustomCalendar } from './CustomCalendar';
import { motion } from 'motion/react';

type SortField = 'code' | 'name' | 'price' | 'change' | 'limitTime' | 'boards' | 'marketCap' | 'sealAmount' | 'sealRatio' | 'sealFlowRatio' | 'highestBoards' | 'turnover' | 'turnoverRate' | 'pe';
type SortDirection = 'asc' | 'desc' | null;

interface SortableStockRowProps {
  stock: Stock;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  showSectorInfo: boolean;
  isLastRow?: boolean;
}

function SortableStockRow({ stock, isFavorite, onToggleFavorite, showSectorInfo, isLastRow = false }: SortableStockRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: stock.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isFavorite ? 'bg-[rgba(99,127,252,0.3)] hover:bg-[rgba(99,127,252,0.4)]' : 'bg-[#2d394b] hover:bg-[#3d4959]'} relative transition-colors duration-200 cursor-pointer`}
    >
      <div className="relative min-h-[52px] flex items-center text-[12px] text-white text-center font-normal leading-[0] py-[8px] w-full">
        <div className="flex-[0_0_5%] min-w-[60px] flex justify-center">
          <motion.button
            onClick={() => onToggleFavorite(stock.id)}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="size-[18px] flex items-center justify-center"
          >
            {isFavorite ? (
              <Star className="size-[18px] fill-[#FEBC30] text-[#FEBC30]" />
            ) : (
              <Star className="size-[18px] fill-none text-[rgba(245,245,245,0.4)]" />
            )}
          </motion.button>
        </div>
        <div className="flex-1 min-w-[60px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.code}</div>
        <div className="flex-1 min-w-[60px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.name}</div>
        <div className="flex-1 min-w-[60px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.price}</div>
        <div className="flex-1 min-w-[60px] font-['Readex_Pro:Regular',sans-serif] text-[#ec3c3c]" style={{ fontVariationSettings: "'HEXP' 0" }}>+{stock.change.toFixed(2)}%</div>
        <div className="flex-1 min-w-[70px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.limitTime.replace(':', ' : ')}</div>
        <div className="flex-1 min-w-[60px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }} {...attributes} {...listeners}>{stock.boards}</div>
        <div className="flex-[2] min-w-[120px] px-[8px] font-['Readex_Pro:Regular',sans-serif] text-left whitespace-normal break-words leading-[1.4]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.reason}</div>
        <div className="flex-1 min-w-[70px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.marketCap}</div>
        <div className="flex-1 min-w-[70px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.sealAmount}</div>
        <div className="flex-1 min-w-[60px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.sealRatio}%</div>
        <div className="flex-1 min-w-[60px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.sealFlowRatio}%</div>
        <div className="flex-1 min-w-[80px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.highestBoards}</div>
        <div className="flex-1 min-w-[70px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.turnover}</div>
        <div className="flex-1 min-w-[60px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.turnoverRate}%</div>
        <div className="flex-1 min-w-[70px] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.pe}</div>
        <div className={`flex-1 min-w-[60px] font-['Readex_Pro:Regular',sans-serif] ${stock.risk !== '无' ? 'text-[#ec3c3c]' : ''}`} style={{ fontVariationSettings: "'HEXP' 0" }}>{stock.risk}</div>
      </div>
      {!isLastRow && (
        <div className="h-[1px] w-full">
          <svg className="block w-full h-[1px]" fill="none" preserveAspectRatio="none" viewBox="0 0 1366 1">
            <line stroke="white" strokeOpacity="0.4" strokeWidth="0.5" x2="1366" y1="0.75" y2="0.75" />
          </svg>
        </div>
      )}
    </div>
  );
}

interface StockReviewAppProps {
  onNavigate: (page: 'home' | 'login' | 'register') => void;
}

export default function StockReviewApp({ onNavigate }: StockReviewAppProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 5)); // October 5, 2025
  const [activeTab, setActiveTab] = useState<'limit-up' | 'favorites'>('limit-up');
  const [activeNavItem, setActiveNavItem] = useState('涨停复盘');
  const [favorites, setFavorites] = useState(['1']);
  const [groupBySector, setGroupBySector] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // 使用API数据
  const { stocks: apiStocks, loading: stocksLoading, error: stocksError } = useStockData(currentDate);
  
  // 如果API数据加载失败，使用模拟数据作为fallback
  const stocks = stocksError ? mockStocks : (apiStocks.length > 0 ? apiStocks : mockStocks);
  
  // Filters for sentiment
  const [sentimentFilters, setSentimentFilters] = useState({
    shenzhenShanghai: true,
    chinext: false,
    star: false,
    bse: false
  });
  
  // Filters for stocks
  const [stockFilters, setStockFilters] = useState({
    shenzhenShanghai: true,
    chinext: false,
    star: false,
    bse: false,
    removeST: false,
    minPrice: '',
    maxPrice: '10',
    minTime: '',
    maxTime: '10 : 30',
    minMarketCap: '',
    maxMarketCap: '50',
    minSealAmount: '1.0',
    minSealRatio: '10',
    minSealFlowRatio: '10'
  });

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Sortable favorites
  const [favoritesOrder, setFavoritesOrder] = useState<string[]>(['1']);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFavoritesOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        setFavoritesOrder(prevOrder => prevOrder.filter(fid => fid !== id));
        return prev.filter(fid => fid !== id);
      } else {
        setFavoritesOrder(prevOrder => [...prevOrder, id]);
        return [...prev, id];
      }
    });
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/ ${month}/ ${day}`;
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleNavClick = (item: string) => {
    setActiveNavItem(item);
    if (item !== '涨停复盘') {
      alert('敬请期待');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedStocks = (stocks: Stock[]) => {
    if (!sortField || !sortDirection) return stocks;
    
    return [...stocks].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  };

  const getDisplayStocks = () => {
    if (activeTab === 'favorites') {
      const favoriteStocks = mockStocks.filter(stock => favorites.includes(stock.id));
      const orderedFavorites = favoritesOrder
        .map(id => favoriteStocks.find(s => s.id === id))
        .filter((s): s is Stock => s !== undefined);
      return getSortedStocks(orderedFavorites);
    }
    return getSortedStocks(mockStocks);
  };

  const groupedStocks = groupBySector
    ? getDisplayStocks().reduce((acc, stock) => {
        if (!acc[stock.sector]) {
          acc[stock.sector] = [];
        }
        acc[stock.sector].push(stock);
        return acc;
      }, {} as Record<string, Stock[]>)
    : null;

  const StockTableHeader = () => (
    <div className="bg-[#2d394b] h-[52px] relative">
      <div className="h-0 absolute bottom-0 w-full">
        <svg className="block w-full h-[1px]" fill="none" preserveAspectRatio="none" viewBox="0 0 1366 1">
          <line stroke="white" strokeOpacity="0.4" strokeWidth="0.5" x2="1366" y1="0.75" y2="0.75" />
        </svg>
      </div>
      <div className="relative h-[52px] flex items-center text-[12px] text-[rgba(255,255,255,0.6)] text-center font-normal leading-[0] w-full">
        <div className="flex-[0_0_5%] min-w-[60px]">操作</div>
        <div className="flex-1 min-w-[60px] cursor-pointer hover:text-white" onClick={() => handleSort('code')}>代码 {sortField === 'code' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[60px] cursor-pointer hover:text-white" onClick={() => handleSort('name')}>名称 {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[60px] cursor-pointer hover:text-white" onClick={() => handleSort('price')}>价格 {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[60px] cursor-pointer hover:text-white" onClick={() => handleSort('change')}>涨跌幅 {sortField === 'change' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[70px] cursor-pointer hover:text-white" onClick={() => handleSort('limitTime')}>涨停时间 {sortField === 'limitTime' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[60px] cursor-pointer hover:text-white" onClick={() => handleSort('boards')}>连板数 {sortField === 'boards' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-[2] min-w-[120px] px-[8px]">涨停原因</div>
        <div className="flex-1 min-w-[70px] cursor-pointer hover:text-white" onClick={() => handleSort('marketCap')}>流通市值(亿) {sortField === 'marketCap' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[70px] cursor-pointer hover:text-white" onClick={() => handleSort('sealAmount')}>封单金额(亿) {sortField === 'sealAmount' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[60px] cursor-pointer hover:text-white" onClick={() => handleSort('sealRatio')}>封成比 {sortField === 'sealRatio' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[60px] cursor-pointer hover:text-white" onClick={() => handleSort('sealFlowRatio')}>封流比 {sortField === 'sealFlowRatio' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[80px] cursor-pointer hover:text-white" onClick={() => handleSort('highestBoards')}>历史最高连板 {sortField === 'highestBoards' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[70px] cursor-pointer hover:text-white" onClick={() => handleSort('turnover')}>成交额(亿) {sortField === 'turnover' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[60px] cursor-pointer hover:text-white" onClick={() => handleSort('turnoverRate')}>换手率 {sortField === 'turnoverRate' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[70px] cursor-pointer hover:text-white" onClick={() => handleSort('pe')}>市盈率(PE) {sortField === 'pe' && (sortDirection === 'asc' ? '↑' : '↓')}</div>
        <div className="flex-1 min-w-[60px]">问题风险</div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#1c2534] min-h-screen w-full text-white">
      {/* Header */}
      <div className="bg-[#1c2534] h-[88px] border-b border-[#2d394b] relative">
        <div className="h-full flex items-center px-[40px] justify-between">
          <div className="flex items-center gap-[16px]">
            <img alt="Logo" className="h-[21px] w-[35px] opacity-60" src={imgLogo} />
            <div className="font-['Open_Sans:SemiBold',sans-serif] text-[28px] text-white opacity-60" style={{ fontVariationSettings: "'wdth' 100" }}>
              Wudao
            </div>
            <div className="font-['Open_Sans:Regular',sans-serif] text-[16px] text-[#637ffc] self-end leading-[28px] -translate-y-[5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              观市若水，投资悟道
            </div>
          </div>
          <div className="flex gap-[13px] items-center">
            <motion.button 
              onClick={() => onNavigate('login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#2d394b] rounded-[20px] h-[40px] w-[85px] text-[14px] hover:bg-[#3d4959] flex items-center justify-center"
            >
              登录
            </motion.button>
            <motion.button 
              onClick={() => onNavigate('register')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#637ffc] rounded-[20px] h-[40px] w-[85px] text-[14px] hover:bg-[#7389fd] flex items-center justify-center"
            >
              注册
            </motion.button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#1c2534] h-[72px] border-b border-[#2d394b] flex items-center px-[24px] gap-[4px]">
        {['涨停复盘', '市场风格', '股友茶会', '悟道天梯'].map((item) => (
          <motion.button
            key={item}
            onClick={() => handleNavClick(item)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`h-[48px] w-[100px] text-[16px] flex items-center justify-center ${
              activeNavItem === item ? 'text-[#637ffc]' : 'text-[rgba(255,255,255,0.7)]'
            } hover:text-[#637ffc]`}
          >
            {item}
          </motion.button>
        ))}
      </div>

      {/* Main Tabs */}
      <div className="bg-[#1c2534] h-[56px] border-b border-[#2d394b] relative">
        <div className="flex h-full pl-[24px] gap-[4px]">
          <motion.button
            onClick={() => setActiveTab('limit-up')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative h-full w-[100px] text-[14px] flex items-center justify-center ${
              activeTab === 'limit-up' ? 'text-white' : 'text-[rgba(255,255,255,0.8)]'
            }`}
          >
            <div className="flex flex-col items-center">
              <span>今日涨停 <span className="text-[#637ffc]">{mockStocks.length}</span></span>
              {activeTab === 'limit-up' && (
                <div className="absolute bottom-0 w-[81px] h-[3px] bg-[#637ffc]" />
              )}
            </div>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('favorites')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative h-full w-[100px] text-[14px] flex items-center justify-center ${
              activeTab === 'favorites' ? 'text-white' : 'text-[rgba(255,255,255,0.8)]'
            }`}
          >
            <div className="flex flex-col items-center">
              <span>今日自选 <span className="text-[#637ffc]">{favorites.length}</span></span>
              {activeTab === 'favorites' && (
                <div className="absolute bottom-0 w-[81px] h-[3px] bg-[#637ffc]" />
              )}
            </div>
          </motion.button>
        </div>
      </div>

      <div className="p-[40px]">
        {/* Title and Calendar */}
        <div className="flex justify-between items-center mb-[42px]">
          <h1 className="text-[25px]">今日短线情绪</h1>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#2d394b] h-[40px] rounded-[20px] px-[12px] flex items-center gap-[8px] cursor-pointer hover:bg-[#3d4959]"
              >
                <motion.button 
                  onClick={() => changeDate(-1)} 
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[rgba(255,255,255,0.6)] hover:text-white"
                >
                  <ChevronLeft className="size-[16px]" />
                </motion.button>
                <CalendarIcon className="size-[19px] text-[rgba(255,255,255,0.6)]" />
                <span className="text-[14px] font-['Readex_Pro:Regular',sans-serif] w-[112px] text-center" style={{ fontVariationSettings: "'HEXP' 0" }}>
                  {formatDate(currentDate)}
                </span>
                <motion.button 
                  onClick={() => changeDate(1)} 
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[rgba(255,255,255,0.6)] hover:text-white"
                >
                  <ChevronRight className="size-[16px]" />
                </motion.button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#2d394b] border-[#637ffc]" align="end">
              <CustomCalendar
                selected={currentDate}
                onSelect={(date) => {
                  setCurrentDate(date);
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Sentiment Filters */}
        <div className="flex gap-[12px] mb-[24px]">
          {[
            { key: 'shenzhenShanghai', label: '深沪两市' },
            { key: 'chinext', label: '创业板' },
            { key: 'star', label: '科创板' },
            { key: 'bse', label: '北证' }
          ].map(({ key, label }) => (
            <label 
              key={key} 
              className="flex items-center gap-[10px] cursor-pointer"
              onClick={() => setSentimentFilters(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
            >
              <div className="relative size-[24px]">
                {sentimentFilters[key as keyof typeof sentimentFilters] ? (
                  <svg className="size-full" fill="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p36920680} fill="#637FFC" />
                  </svg>
                ) : (
                  <div className="bg-[#1c2534] border-2 border-[rgba(245,245,245,0.6)] rounded-[3px] size-[18px] m-[3px]" />
                )}
              </div>
              <span className="text-[12px]">{label}</span>
            </label>
          ))}
        </div>

        {/* Sentiment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-[24px] mb-[60px]">
          {[
            { label: '两市成交量', value: '22,000', unit: '亿', change: '-191.6亿', isNegative: true },
            { label: '最高连板', value: '6', unit: '板', subtext: '4周内最高12板', isNegative: true },
            { label: '涨停数', value: '100', unit: '只', change: '+8只', isNegative: false },
            { label: '涨停封板率', value: '60', unit: '%', change: '-25%', isNegative: true },
            { label: '跌停数', value: '11', unit: '只', change: '-5只', isNegative: true },
            { label: '跌停封板率', value: '50', unit: '%', change: '-10%', isNegative: true },
            { label: '连板晋级率', value: '42.8', unit: '%', change: '-25%', isNegative: true },
            { label: '断板次日修复率', value: '48.2', unit: '%', change: '+10%', isNegative: false }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#2d394b] rounded-[10px] p-[23px] relative">
              <div className="text-[12px] text-[rgba(255,255,255,0.6)] mb-[14px]">{item.label}</div>
              <div className="text-[28px] mb-[14px]">
                <span className="font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>{item.value}</span>
                <span className="text-[12px]">{item.unit}</span>
              </div>
              {item.change && (
                <div className={`text-[12px] ${item.isNegative ? 'text-[#cff529]' : 'text-[#ec3c3c]'} font-['Readex_Pro:Regular',sans-serif]`} style={{ fontVariationSettings: "'HEXP' 0" }}>
                  {item.change}
                </div>
              )}
              {item.subtext && (
                <div className="text-[12px] text-[#cff529] font-['Readex_Pro:Regular',sans-serif]" style={{ fontVariationSettings: "'HEXP' 0" }}>
                  {item.subtext}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stock Section Title and Group Toggle */}
        <div className="flex items-center gap-[16px] mb-[24px]">
          <h1 className="text-[25px]">{activeTab === 'limit-up' ? '今日涨停个股' : '今日自选'}</h1>
          <span className="text-[14px] text-[rgba(245,245,245,0.6)]">按题材分组</span>
          <div className="h-[31px] w-[1px] bg-[rgba(245,245,245,0.4)]" />
          <motion.button
            onClick={() => setGroupBySector(!groupBySector)}
            whileTap={{ scale: 0.9 }}
            className={`relative w-[52px] h-[32px] rounded-[15px] transition-colors ${
              groupBySector ? 'bg-[#637ffc]' : 'bg-[rgba(245,245,245,0.3)]'
            }`}
          >
            <motion.div
              animate={{ x: groupBySector ? 24 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-[4px] w-[24px] h-[24px] rounded-full bg-white"
            />
          </motion.button>
        </div>

        {/* Stock Filters */}
        <div className="flex gap-[12px] mb-[40px] flex-wrap items-center">
          {[
            { key: 'shenzhenShanghai', label: '深沪两市' },
            { key: 'chinext', label: '创业板' },
            { key: 'star', label: '科创板' },
            { key: 'bse', label: '北证' },
            { key: 'removeST', label: '去除ST' }
          ].map(({ key, label }) => (
            <label 
              key={key} 
              className="flex items-center gap-[10px] cursor-pointer flex-shrink-0"
              onClick={() => setStockFilters(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
            >
              <div className="relative size-[24px]">
                {stockFilters[key as keyof typeof stockFilters] ? (
                  <svg className="size-full" fill="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p36920680} fill="#637FFC" />
                  </svg>
                ) : (
                  <div className="bg-[#1c2534] border-2 border-[rgba(245,245,245,0.6)] rounded-[3px] size-[18px] m-[3px]" />
                )}
              </div>
              <span className="text-[12px] whitespace-nowrap">{label}</span>
            </label>
          ))}
        </div>

        {/* Filter Inputs */}
        <div className="flex gap-[16px] mb-[40px] flex-wrap items-center">
          {/* 股票价格 (元) */}
          <div className="relative bg-[#1c2534] border border-[#9ea2a8] rounded-[5px] h-[40px] min-w-[160px] w-[173px] max-w-full px-[12px] flex items-center justify-center gap-[8px] flex-shrink-0">
            <div className="absolute bg-[#1c2534] h-[14px] left-[10px] top-[-7px] px-[4px] flex items-center">
              <span className="text-[10px] text-white font-['Readex_Pro:Regular',sans-serif] leading-[0] whitespace-nowrap" style={{ fontVariationSettings: "'HEXP' 0" }}>股票价格 (元)</span>
            </div>
            <input
              type="text"
              placeholder="最小值"
              className="bg-transparent text-[14px] text-[rgba(255,255,255,0.6)] w-[45px] outline-none text-center font-['Readex_Pro:Regular',sans-serif]"
              style={{ fontVariationSettings: "'HEXP' 0" }}
            />
            <span className="text-[#9ea2a8] flex-shrink-0">-</span>
            <input
              type="text"
              className="bg-transparent text-[14px] text-[#637ffc] w-[45px] outline-none text-center font-['Readex_Pro:Regular',sans-serif]"
              style={{ fontVariationSettings: "'HEXP' 0" }}
              defaultValue="10"
            />
          </div>
          {/* 涨停时间 */}
          <div className="relative bg-[#1c2534] border border-[#9ea2a8] rounded-[5px] h-[40px] min-w-[160px] w-[173px] max-w-full px-[12px] flex items-center justify-center gap-[8px] flex-shrink-0">
            <div className="absolute bg-[#1c2534] h-[14px] left-[10px] top-[-7px] px-[4px] flex items-center">
              <span className="text-[10px] text-white font-['Readex_Pro:Regular',sans-serif] leading-[0] whitespace-nowrap" style={{ fontVariationSettings: "'HEXP' 0" }}>涨停时间</span>
            </div>
            <input
              type="text"
              placeholder="-- : --"
              className="bg-transparent text-[14px] text-[rgba(255,255,255,0.6)] w-[45px] outline-none text-center font-['Readex_Pro:Regular',sans-serif]"
              style={{ fontVariationSettings: "'HEXP' 0" }}
            />
            <span className="text-[#9ea2a8] flex-shrink-0">-</span>
            <input
              type="text"
              className="bg-transparent text-[14px] text-[#637ffc] w-[45px] outline-none text-center font-['Readex_Pro:Regular',sans-serif]"
              style={{ fontVariationSettings: "'HEXP' 0" }}
              defaultValue="10 : 30"
            />
          </div>
          {/* 流通市值 (亿) */}
          <div className="relative bg-[#1c2534] border border-[#9ea2a8] rounded-[5px] h-[40px] min-w-[160px] w-[173px] max-w-full px-[12px] flex items-center justify-center gap-[8px] flex-shrink-0">
            <div className="absolute bg-[#1c2534] h-[14px] left-[10px] top-[-7px] px-[4px] flex items-center">
              <span className="text-[10px] text-white font-['Readex_Pro:Regular',sans-serif] leading-[0] whitespace-nowrap" style={{ fontVariationSettings: "'HEXP' 0" }}>流通市值 (亿)</span>
            </div>
            <input
              type="text"
              placeholder="最小值"
              className="bg-transparent text-[14px] text-[rgba(255,255,255,0.6)] w-[45px] outline-none text-center font-['Readex_Pro:Regular',sans-serif]"
              style={{ fontVariationSettings: "'HEXP' 0" }}
            />
            <span className="text-[#9ea2a8] flex-shrink-0">-</span>
            <input
              type="text"
              className="bg-transparent text-[14px] text-[#637ffc] w-[45px] outline-none text-center font-['Readex_Pro:Regular',sans-serif]"
              style={{ fontVariationSettings: "'HEXP' 0" }}
              defaultValue="50"
            />
          </div>
          {/* 最低封单金额 (亿) */}
          <div className="relative bg-[#1c2534] border border-[#9ea2a8] rounded-[5px] h-[40px] min-w-[100px] w-[109px] max-w-full px-[12px] flex items-center justify-center flex-shrink-0">
            <div className="absolute bg-[#1c2534] h-[14px] left-[10px] top-[-7px] px-[4px] flex items-center">
              <span className="text-[10px] text-white font-['Readex_Pro:Regular',sans-serif] whitespace-nowrap leading-[0]" style={{ fontVariationSettings: "'HEXP' 0" }}>最低封单金额 (亿)</span>
            </div>
            <input
              type="text"
              className="bg-transparent text-[14px] text-[#637ffc] w-[45px] outline-none text-center font-['Readex_Pro:Regular',sans-serif]"
              style={{ fontVariationSettings: "'HEXP' 0" }}
              defaultValue="1.0"
            />
          </div>
          {/* 最低封成比 (%) */}
          <div className="relative bg-[#1c2534] border border-[#9ea2a8] rounded-[5px] h-[40px] min-w-[100px] w-[109px] max-w-full px-[12px] flex items-center justify-center flex-shrink-0">
            <div className="absolute bg-[#1c2534] h-[14px] left-[10px] top-[-7px] px-[4px] flex items-center">
              <span className="text-[10px] text-white font-['Readex_Pro:Regular',sans-serif] whitespace-nowrap leading-[0]" style={{ fontVariationSettings: "'HEXP' 0" }}>最低封成比 (%)</span>
            </div>
            <input
              type="text"
              className="bg-transparent text-[14px] text-[#637ffc] w-[45px] outline-none text-center font-['Readex_Pro:Regular',sans-serif]"
              style={{ fontVariationSettings: "'HEXP' 0" }}
              defaultValue="10"
            />
          </div>
          {/* 最低封流比 (%) */}
          <div className="relative bg-[#1c2534] border border-[#9ea2a8] rounded-[5px] h-[40px] min-w-[100px] w-[109px] max-w-full px-[12px] flex items-center justify-center flex-shrink-0">
            <div className="absolute bg-[#1c2534] h-[14px] left-[10px] top-[-7px] px-[4px] flex items-center">
              <span className="text-[10px] text-white font-['Readex_Pro:Regular',sans-serif] whitespace-nowrap leading-[0]" style={{ fontVariationSettings: "'HEXP' 0" }}>最低封流比 (%)</span>
            </div>
            <input
              type="text"
              className="bg-transparent text-[14px] text-[#637ffc] w-[45px] outline-none text-center font-['Readex_Pro:Regular',sans-serif]"
              style={{ fontVariationSettings: "'HEXP' 0" }}
              defaultValue="10"
            />
          </div>
          
          {/* Filter Buttons */}
          <motion.button
            onClick={() => {
              // TODO: 实现筛选逻辑
              console.log('应用筛选');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#637ffc] rounded-[20px] h-[40px] min-w-[100px] w-[120px] px-[16px] text-[14px] text-white hover:bg-[#7389fd] transition-colors flex items-center justify-center flex-shrink-0"
          >
            筛选
          </motion.button>
          <motion.button
            onClick={() => {
              setStockFilters({
                shenzhenShanghai: true,
                chinext: false,
                star: false,
                bse: false,
                removeST: false,
                minPrice: '',
                maxPrice: '10',
                minTime: '',
                maxTime: '10 : 30',
                minMarketCap: '',
                maxMarketCap: '50',
                minSealAmount: '1.0',
                minSealRatio: '10',
                minSealFlowRatio: '10'
              });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#2d394b] rounded-[20px] h-[40px] min-w-[100px] w-[120px] px-[16px] text-[14px] text-white hover:bg-[#3d4959] transition-colors flex items-center justify-center flex-shrink-0"
          >
            清除筛选
          </motion.button>
        </div>

        {/* Stock Tables */}
        <div className="space-y-[40px]">
          {groupBySector && groupedStocks ? (
            Object.entries(groupedStocks).map(([sector, stocks]) => (
              <div key={sector} className="bg-[#2d394b] rounded-[20px] overflow-hidden">
                <div className="p-[28px]">
                  <div className="text-[#637ffc] text-[16px] mb-[24px]">
                    <span className="font-['Readex_Pro:SemiBold',sans-serif] text-[#febc30]" style={{ fontVariationSettings: "'HEXP' 0" }}>
                      {sector}: {sectorReasons[sector]} <span className="text-[#ec3c3c]">(已持续{sectorDuration[sector]}天)</span>
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-[1400px]">
                      <StockTableHeader />
                      {stocks.map((stock, index) => (
                        <SortableStockRow
                          key={stock.id}
                          stock={stock}
                          isFavorite={favorites.includes(stock.id)}
                          onToggleFavorite={toggleFavorite}
                          showSectorInfo={false}
                          isLastRow={index === stocks.length - 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#2d394b] rounded-[20px] overflow-hidden">
              <div className="p-[28px]">
                <div className="overflow-x-auto">
                  <div className="min-w-[1400px]">
                    <StockTableHeader />
                    {activeTab === 'favorites' ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={favoritesOrder}
                          strategy={verticalListSortingStrategy}
                        >
                          {getDisplayStocks().map((stock, index, array) => (
                            <SortableStockRow
                              key={stock.id}
                              stock={stock}
                              isFavorite={favorites.includes(stock.id)}
                              onToggleFavorite={toggleFavorite}
                              showSectorInfo={true}
                              isLastRow={index === array.length - 1}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    ) : (
                      getDisplayStocks().map((stock, index, array) => (
                        <SortableStockRow
                          key={stock.id}
                          stock={stock}
                          isFavorite={favorites.includes(stock.id)}
                          onToggleFavorite={toggleFavorite}
                          showSectorInfo={true}
                          isLastRow={index === array.length - 1}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
