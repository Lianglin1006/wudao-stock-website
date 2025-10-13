#!/usr/bin/env python3
"""
启动Express服务器的Python脚本
用于绕过Node.js环境配置问题
"""

import subprocess
import sys
import os
import time
import signal

def find_node_executable():
    """查找可用的Node.js可执行文件"""
    possible_paths = [
        '/usr/local/bin/node',
        '/usr/bin/node',
        '/opt/homebrew/bin/node',
        'node'
    ]
    
    for path in possible_paths:
        try:
            result = subprocess.run([path, '--version'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                print(f"找到Node.js: {path} (版本: {result.stdout.strip()})")
                return path
        except (subprocess.TimeoutExpired, FileNotFoundError):
            continue
    
    return None

def start_express_server():
    """启动Express服务器"""
    print("=== 启动Express服务器 ===\n")
    
    # 查找Node.js
    node_path = find_node_executable()
    if not node_path:
        print("❌ 未找到Node.js，尝试使用系统默认的node命令")
        node_path = 'node'
    
    # 检查app.js文件
    app_path = os.path.join(os.path.dirname(__file__), 'src', 'app.js')
    if not os.path.exists(app_path):
        print(f"❌ 未找到应用文件: {app_path}")
        return False
    
    try:
        print(f"🚀 启动服务器: {node_path} {app_path}")
        print("📡 服务器将在 http://localhost:3000 启动")
        print("🔄 AKShare数据集成已启用")
        print("⚠️  标记为'--'的字段表示无法从AKShare获取的数据")
        print("\n按 Ctrl+C 停止服务器\n")
        
        # 启动服务器
        process = subprocess.Popen([node_path, app_path], 
                                 cwd=os.path.dirname(__file__))
        
        # 等待进程结束或用户中断
        try:
            process.wait()
        except KeyboardInterrupt:
            print("\n\n🛑 收到停止信号，正在关闭服务器...")
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                print("强制终止服务器进程")
                process.kill()
            print("✅ 服务器已停止")
        
        return True
        
    except FileNotFoundError:
        print(f"❌ 无法启动Node.js: {node_path}")
        print("请确保已安装Node.js")
        return False
    except Exception as e:
        print(f"❌ 启动服务器时出错: {e}")
        return False

if __name__ == "__main__":
    success = start_express_server()
    sys.exit(0 if success else 1)