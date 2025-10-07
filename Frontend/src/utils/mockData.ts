// Mock data for stock review application

export interface Stock {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  limitTime: string;
  boards: number;
  reason: string;
  reasonDetail?: string;
  marketCap: number;
  sealAmount: number;
  sealRatio: number;
  sealFlowRatio: number;
  highestBoards: number;
  turnover: number;
  turnoverRate: number;
  pe: number;
  risk: string;
  sector: string;
}

// Generate more mock data to reach ~86 stocks
const generateMockStocks = (): Stock[] => {
  const sectors = ['AI芯片', '有色金属', '新能源', '医药医疗', '消费电子'];
  const sectorReasonsList = [
    '国家发布人工智能芯片发展规划，政策利好推动板块爆发',
    '八部门印发《有色金属行业稳增长工作方案（2025-2026）》',
    '新能源政策持续利好，市场关注度持续升温',
    '医药创新政策发布，行业发展迎来新机遇',
    '消费电子产品需求回暖，行业景气度提升'
  ];
  
  const baseStocks: Stock[] = [
    {
      id: '1',
      code: '600000',
      name: '浦发银行',
      price: 51.23,
      change: 9.99,
      limitTime: '09:32',
      boards: 3,
      reason: '证券+国企改革+中保增长+处置股权',
      marketCap: 907,
      sealAmount: 1.1,
      sealRatio: 10.2,
      sealFlowRatio: 5.2,
      highestBoards: 5,
      turnover: 28.2,
      turnoverRate: 15,
      pe: 15,
      risk: '退市风险',
      sector: 'AI芯片'
    },
    {
      id: '2',
      code: '600008',
      name: '澜起科技',
      price: 64.65,
      change: 10.01,
      limitTime: '10:31',
      boards: 1,
      reason: '上海微电子相关+工程设计+城市更新+上海国资',
      marketCap: 539,
      sealAmount: 2.3,
      sealRatio: 20.6,
      sealFlowRatio: 10.1,
      highestBoards: 3,
      turnover: 15.2,
      turnoverRate: 24,
      pe: 56,
      risk: '无',
      sector: 'AI芯片'
    },
    {
      id: '3',
      code: '300014',
      name: '亿纬锂能',
      price: 36.61,
      change: 10.00,
      limitTime: '14:31',
      boards: 5,
      reason: '稀土永磁+中保增长+员工持股+产能扩张',
      marketCap: 332,
      sealAmount: 0.5,
      sealRatio: 3.3,
      sealFlowRatio: 0.62,
      highestBoards: 4,
      turnover: 8.5,
      turnoverRate: 35,
      pe: 156,
      risk: '无',
      sector: 'AI芯片'
    },
    {
      id: '4',
      code: '600001',
      name: '邯郸钢铁',
      price: 42.18,
      change: 9.98,
      limitTime: '09:45',
      boards: 2,
      reason: '钢铁行业+国企改革+产能优化',
      marketCap: 456,
      sealAmount: 1.8,
      sealRatio: 15.3,
      sealFlowRatio: 7.8,
      highestBoards: 4,
      turnover: 20.5,
      turnoverRate: 18,
      pe: 22,
      risk: '无',
      sector: '有色金属'
    },
    {
      id: '5',
      code: '002594',
      name: '比亚迪',
      price: 245.67,
      change: 10.00,
      limitTime: '09:30',
      boards: 1,
      reason: '新能源汽车+电池技术+智能驾驶',
      marketCap: 7156,
      sealAmount: 15.6,
      sealRatio: 28.9,
      sealFlowRatio: 12.3,
      highestBoards: 2,
      turnover: 125.8,
      turnoverRate: 8,
      pe: 45,
      risk: '无',
      sector: '有色金属'
    },
    {
      id: '6',
      code: '688981',
      name: '中芯国际',
      price: 58.32,
      change: 20.00,
      limitTime: '09:31',
      boards: 6,
      reason: '芯片制造+国产替代+科技自主',
      marketCap: 4521,
      sealAmount: 8.9,
      sealRatio: 35.6,
      sealFlowRatio: 15.2,
      highestBoards: 8,
      turnover: 85.3,
      turnoverRate: 32,
      pe: 78,
      risk: '无',
      sector: '有色金属'
    }
  ];
  
  // Generate additional stocks
  const additionalStocks: Stock[] = [];
  const stockNames = ['华为科技', '腾讯控股', '阿里巴巴', '京东集团', '美团', '小米集团', '宁德时代', '长城汽车', '长安汽车', '格力电器', '海尔智家', '五粮液', '贵州茅台', '伊利股份', '中国平安', '招商银行', '工商银行', '建设银行', '中国石油', '中国石化'];
  
  for (let i = 0; i < 80; i++) {
    const sectorIndex = i % sectors.length;
    const stockCode = `${600000 + i + 10}`;
    additionalStocks.push({
      id: `${i + 7}`,
      code: stockCode,
      name: stockNames[i % stockNames.length] + (i > 19 ? Math.floor(i / 20) : ''),
      price: Number((Math.random() * 100 + 10).toFixed(2)),
      change: Number((Math.random() * 10 + 0.1).toFixed(2)),
      limitTime: `${String(9 + Math.floor(Math.random() * 6)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      boards: Math.floor(Math.random() * 7) + 1,
      reason: `题材概念${i + 1}+政策利好+业绩增长`,
      marketCap: Number((Math.random() * 5000 + 100).toFixed(0)),
      sealAmount: Number((Math.random() * 20 + 0.5).toFixed(1)),
      sealRatio: Number((Math.random() * 40 + 5).toFixed(1)),
      sealFlowRatio: Number((Math.random() * 20 + 1).toFixed(1)),
      highestBoards: Math.floor(Math.random() * 10) + 1,
      turnover: Number((Math.random() * 150 + 5).toFixed(1)),
      turnoverRate: Number((Math.random() * 40 + 5).toFixed(0)),
      pe: Number((Math.random() * 100 + 10).toFixed(0)),
      risk: Math.random() > 0.9 ? '退市风险' : '无',
      sector: sectors[sectorIndex]
    });
  }
  
  return [...baseStocks, ...additionalStocks];
};

export const mockStocks: Stock[] = generateMockStocks();

export const sectorReasons: Record<string, string> = {
  'AI芯片': '国家发布人工智能芯片发展规划，政策利好推动板块爆发',
  '有色金属': '八部门印发《有色金属行业稳增长工作方案（2025-2026）》',
  '新能源': '新能源政策持续利好，市场关注度持续升温',
  '医药医疗': '医药创新政策发布，行业发展迎来新机遇',
  '消费电子': '消费电子产品需求回暖，行业景气度提升'
};

export const sectorDuration: Record<string, number> = {
  'AI芯片': 3,
  '有色金属': 5,
  '新能源': 2,
  '医药医疗': 1,
  '消费电子': 4
};

export interface SentimentData {
  volume: number;
  volumeChange: number;
  highestBoards: number;
  highestBoardsIn4Weeks: number;
  limitUpCount: number;
  limitUpCountChange: number;
  limitUpSealRate: number;
  limitUpSealRateChange: number;
  limitDownCount: number;
  limitDownCountChange: number;
  limitDownSealRate: number;
  limitDownSealRateChange: number;
  boardPromotionRate: number;
  boardPromotionRateChange: number;
  failedBoardRecoveryRate: number;
  failedBoardRecoveryRateChange: number;
}

export const mockSentimentData: SentimentData = {
  volume: 22000,
  volumeChange: -191.6,
  highestBoards: 6,
  highestBoardsIn4Weeks: 12,
  limitUpCount: 100,
  limitUpCountChange: 8,
  limitUpSealRate: 60,
  limitUpSealRateChange: -25,
  limitDownCount: 11,
  limitDownCountChange: -5,
  limitDownSealRate: 50,
  limitDownSealRateChange: -10,
  boardPromotionRate: 42.8,
  boardPromotionRateChange: -25,
  failedBoardRecoveryRate: 48.2,
  failedBoardRecoveryRateChange: 10
};
