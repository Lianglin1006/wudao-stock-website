#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AKShare数据获取客户端
用于获取真实的股票数据
"""

import akshare as ak
import json
import sys
import pandas as pd
from datetime import datetime, timedelta

def get_stock_realtime_data():
    """获取A股实时行情数据"""
    try:
        # 获取A股实时行情
        df = ak.stock_zh_a_spot_em()
        
        # 转换为我们需要的格式
        result = []
        for _, row in df.head(50).iterrows():  # 只取前50条数据
            stock_data = {
                "code": str(row["代码"]),
                "name": str(row["名称"]),
                "price": float(row["最新价"]) if pd.notna(row["最新价"]) else "--",
                "change_pct": float(row["涨跌幅"]) if pd.notna(row["涨跌幅"]) else "--",
                "change_amount": float(row["涨跌额"]) if pd.notna(row["涨跌额"]) else "--",
                "volume": int(row["成交量"]) if pd.notna(row["成交量"]) else "--",
                "amount": float(row["成交额"]) if pd.notna(row["成交额"]) else "--",
                "turnover": float(row["换手率"]) if pd.notna(row["换手率"]) else "--",
                "pe_ratio": float(row["市盈率-动态"]) if pd.notna(row["市盈率-动态"]) else "--",
                "pb_ratio": float(row["市净率"]) if pd.notna(row["市净率"]) else "--",
                "market_cap": float(row["总市值"]) if pd.notna(row["总市值"]) else "--",
                "circulation_market_cap": float(row["流通市值"]) if pd.notna(row["流通市值"]) else "--",
                "high": float(row["最高"]) if pd.notna(row["最高"]) else "--",
                "low": float(row["最低"]) if pd.notna(row["最低"]) else "--",
                "open": float(row["今开"]) if pd.notna(row["今开"]) else "--",
                "pre_close": float(row["昨收"]) if pd.notna(row["昨收"]) else "--",
                # 无法从AKShare直接获取的字段用"--"标记
                "riskFlags": "--",
                "sector": "--",
                "limit_time": "--",
                "reason": "--"
            }
            result.append(stock_data)
        
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_limit_up_stocks(date=None):
    """获取涨停股票数据"""
    try:
        if not date:
            date = datetime.now().strftime('%Y%m%d')
        
        # 获取涨停股池数据
        df = ak.stock_zt_pool_em(date=date)
        
        result = []
        for _, row in df.iterrows():
            stock_data = {
                "code": str(row["代码"]),
                "name": str(row["名称"]),
                "price": float(row["最新价"]) if pd.notna(row["最新价"]) else "--",
                "change_pct": float(row["涨跌幅"]) if pd.notna(row["涨跌幅"]) else "--",
                "limit_time": str(row["首次封板时间"]) if pd.notna(row["首次封板时间"]) else "--",
                "last_limit_time": str(row["最后封板时间"]) if pd.notna(row["最后封板时间"]) else "--",
                "limit_amount": float(row["封板资金"]) if pd.notna(row["封板资金"]) else "--",
                "break_times": int(row["炸板次数"]) if pd.notna(row["炸板次数"]) else "--",
                "continuous_limit": int(row["连板数"]) if pd.notna(row["连板数"]) else "--",
                "sector": str(row["所属行业"]) if pd.notna(row["所属行业"]) else "--",
                "market_cap": float(row["总市值"]) if pd.notna(row["总市值"]) else "--",
                "turnover": float(row["换手率"]) if pd.notna(row["换手率"]) else "--",
                # 无法获取的字段
                "reason": "--",
                "riskFlags": "--"
            }
            result.append(stock_data)
        
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_limit_down_stocks(date=None):
    """获取跌停股票数据"""
    try:
        if not date:
            date = datetime.now().strftime('%Y%m%d')
        
        # 获取跌停股池数据
        df = ak.stock_zt_pool_dtgc_em(date=date)
        
        result = []
        for _, row in df.iterrows():
            stock_data = {
                "code": str(row["代码"]),
                "name": str(row["名称"]),
                "price": float(row["最新价"]) if pd.notna(row["最新价"]) else "--",
                "change_pct": float(row["涨跌幅"]) if pd.notna(row["涨跌幅"]) else "--",
                "limit_time": str(row["最后封板时间"]) if pd.notna(row["最后封板时间"]) else "--",
                "continuous_limit": int(row["连续跌停"]) if pd.notna(row["连续跌停"]) else "--",
                "break_times": int(row["开板次数"]) if pd.notna(row["开板次数"]) else "--",
                "sector": str(row["所属行业"]) if pd.notna(row["所属行业"]) else "--",
                "market_cap": float(row["总市值"]) if pd.notna(row["总市值"]) else "--",
                "turnover": float(row["换手率"]) if pd.notna(row["换手率"]) else "--",
                "pe_ratio": float(row["动态市盈率"]) if pd.notna(row["动态市盈率"]) else "--",
                # 无法获取的字段
                "reason": "--",
                "riskFlags": "--"
            }
            result.append(stock_data)
        
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_stock_info(symbol):
    """获取单个股票信息"""
    try:
        # 从实时行情中获取单个股票信息
        df = ak.stock_zh_a_spot_em()
        stock_row = df[df["代码"] == symbol]
        
        if stock_row.empty:
            return {"success": False, "error": f"未找到股票代码 {symbol}"}
        
        row = stock_row.iloc[0]
        stock_data = {
            "symbol": str(row["代码"]),
            "name": str(row["名称"]),
            "price": float(row["最新价"]) if pd.notna(row["最新价"]) else "--",
            "change_pct": float(row["涨跌幅"]) if pd.notna(row["涨跌幅"]) else "--",
            "market_cap": float(row["总市值"]) if pd.notna(row["总市值"]) else "--",
            "pe_ratio": float(row["市盈率-动态"]) if pd.notna(row["市盈率-动态"]) else "--",
            # 无法获取的字段
            "market": "--",
            "industry": "--",
            "list_date": "--"
        }
        
        return {"success": True, "data": stock_data}
    except Exception as e:
        return {"success": False, "error": str(e)}

def main():
    """主函数，根据命令行参数调用不同的函数"""
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "缺少参数"}))
        return
    
    command = sys.argv[1]
    
    if command == "realtime":
        result = get_stock_realtime_data()
    elif command == "limit_up":
        date = sys.argv[2] if len(sys.argv) > 2 else None
        result = get_limit_up_stocks(date)
    elif command == "limit_down":
        date = sys.argv[2] if len(sys.argv) > 2 else None
        result = get_limit_down_stocks(date)
    elif command == "stock_info":
        if len(sys.argv) < 3:
            result = {"success": False, "error": "缺少股票代码参数"}
        else:
            symbol = sys.argv[2]
            result = get_stock_info(symbol)
    else:
        result = {"success": False, "error": f"未知命令: {command}"}
    
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()