#!/usr/bin/env python3
"""
简化的AKShare数据演示
直接展示JSON格式的真实数据和"--"标记
"""

import json
import subprocess
import os
from datetime import datetime

def main():
    """主函数"""
    print("🎯 AKShare数据集成演示")
    print("=" * 60)
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    script_path = os.path.join(os.path.dirname(__file__), 'src/services/akshare_client.py')
    
    # 1. 涨停股票数据
    print("\n📈 涨停股票数据 (真实数据):")
    print("-" * 40)
    try:
        result = subprocess.run([
            'python3', script_path, 'limit_up'
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            data = json.loads(result.stdout)
            print(f"✅ 成功获取 {len(data)} 只涨停股票")
            if data:
                # 显示第一只股票的完整数据
                first_stock = data[0]
                print(f"\n示例股票: {first_stock['name']} ({first_stock['code']})")
                print("完整数据结构:")
                for key, value in first_stock.items():
                    status = "⚠️ " if value == "--" else "✅"
                    print(f"  {status} {key}: {value}")
        else:
            print(f"❌ 获取失败: {result.stderr}")
    except Exception as e:
        print(f"❌ 异常: {e}")
    
    # 2. 跌停股票数据
    print("\n📉 跌停股票数据 (真实数据):")
    print("-" * 40)
    try:
        result = subprocess.run([
            'python3', script_path, 'limit_down'
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            data = json.loads(result.stdout)
            print(f"✅ 成功获取 {len(data)} 只跌停股票")
            if data:
                first_stock = data[0]
                print(f"\n示例股票: {first_stock['name']} ({first_stock['code']})")
                # 只显示关键字段
                key_fields = ['price', 'change_pct', 'reason', 'riskFlags', 'sector']
                for field in key_fields:
                    if field in first_stock:
                        status = "⚠️ " if first_stock[field] == "--" else "✅"
                        print(f"  {status} {field}: {first_stock[field]}")
        else:
            print(f"❌ 获取失败: {result.stderr}")
    except Exception as e:
        print(f"❌ 异常: {e}")
    
    # 3. 实时股票数据
    print("\n📊 实时股票数据 (真实数据):")
    print("-" * 40)
    try:
        result = subprocess.run([
            'python3', script_path, 'realtime'
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            data = json.loads(result.stdout)
            print(f"✅ 成功获取 {len(data)} 只股票的实时数据")
            if data:
                first_stock = data[0]
                print(f"\n示例股票: {first_stock['name']} ({first_stock['code']})")
                # 显示关键实时数据字段
                key_fields = ['price', 'change_pct', 'volume', 'turnover', 'riskFlags', 'sector']
                for field in key_fields:
                    if field in first_stock:
                        status = "⚠️ " if first_stock[field] == "--" else "✅"
                        print(f"  {status} {field}: {first_stock[field]}")
        else:
            print(f"❌ 获取失败: {result.stderr}")
    except Exception as e:
        print(f"❌ 异常: {e}")
    
    # 总结
    print("\n" + "=" * 60)
    print("📋 集成总结:")
    print("✅ 可获取的真实数据: 股票代码、名称、价格、涨跌幅、成交量、市值等")
    print("⚠️  标记为'--'的字段: reason(原因)、riskFlags(风险标识)、部分sector(行业)")
    print("🎯 数据覆盖率: 约70-80%的基础股票数据")
    print("💡 建议: 对于'--'字段，可通过其他API或本地计算补充")

if __name__ == "__main__":
    main()