import { useState } from 'react';
import { motion } from 'motion/react';
import imgLogo from 'figma:asset/7f4b65dfc7ecdec7423b09f3f147f9972055131b.png';
import { Eye, EyeOff } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb';

interface RegisterPageProps {
  onNavigate: (page: 'home' | 'login' | 'register') => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证密码匹配
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致！');
      return;
    }

    // 验证用户协议
    if (!formData.agree) {
      alert('请先同意用户协议和隐私政策！');
      return;
    }

    // TODO: 实现注册逻辑
    console.log('注册提交:', formData);
    alert('注册功能开发中...');
  };

  return (
    <div className="bg-[#1c2534] min-h-screen w-full text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#1c2534] h-[88px] border-b border-[#2d394b]">
        <div className="h-full flex items-center px-[40px] justify-between">
          <motion.div 
            className="flex items-center gap-[16px] cursor-pointer"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img alt="Logo" className="h-[21px] w-[35px] opacity-60" src={imgLogo} />
            <div className="font-['Open_Sans:SemiBold',sans-serif] text-[28px] text-white opacity-60" style={{ fontVariationSettings: "'wdth' 100" }}>
              Wudao
            </div>
            <div className="font-['Open_Sans:Regular',sans-serif] text-[16px] text-[#637ffc] self-end leading-[28px] -translate-y-[5px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              观市若水，投资悟道
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-[40px]">
        {/* Breadcrumb */}
        <div className="mb-[24px]">
          <Breadcrumb>
            <BreadcrumbList className="text-[rgba(255,255,255,0.6)]">
              <BreadcrumbItem>
                <BreadcrumbLink 
                  asChild
                  className="cursor-pointer hover:text-white text-[14px]"
                >
                  <motion.span
                    onClick={() => onNavigate('home')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    首页
                  </motion.span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[rgba(255,255,255,0.4)]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white text-[14px]">注册</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#2d394b] rounded-[20px] p-[60px] w-full max-w-[480px]"
          >
          <h1 className="text-[32px] text-center mb-[12px]">注册</h1>
          <p className="text-center text-[14px] text-[rgba(255,255,255,0.6)] mb-[40px]">
            创建您的 Wudao 账号
          </p>

          <form onSubmit={handleSubmit} className="space-y-[24px]">
            {/* Username */}
            <div>
              <label className="block text-[14px] mb-[8px]">用户名</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="请输入用户名"
                className="w-full bg-[#1c2534] border border-[#9ea2a8] rounded-[10px] h-[48px] px-[16px] text-[14px] text-white placeholder:text-[rgba(255,255,255,0.4)] outline-none focus:border-[#637ffc] transition-colors"
                required
                minLength={3}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[14px] mb-[8px]">邮箱</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入邮箱地址"
                className="w-full bg-[#1c2534] border border-[#9ea2a8] rounded-[10px] h-[48px] px-[16px] text-[14px] text-white placeholder:text-[rgba(255,255,255,0.4)] outline-none focus:border-[#637ffc] transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[14px] mb-[8px]">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="请输入密码（至少8位）"
                  className="w-full bg-[#1c2534] border border-[#9ea2a8] rounded-[10px] h-[48px] px-[16px] pr-[48px] text-[14px] text-white placeholder:text-[rgba(255,255,255,0.4)] outline-none focus:border-[#637ffc] transition-colors"
                  required
                  minLength={8}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.6)] hover:text-white"
                >
                  {showPassword ? <EyeOff className="size-[20px]" /> : <Eye className="size-[20px]" />}
                </motion.button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[14px] mb-[8px]">确认密码</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="请再次输入密码"
                  className="w-full bg-[#1c2534] border border-[#9ea2a8] rounded-[10px] h-[48px] px-[16px] pr-[48px] text-[14px] text-white placeholder:text-[rgba(255,255,255,0.4)] outline-none focus:border-[#637ffc] transition-colors"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.6)] hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="size-[20px]" /> : <Eye className="size-[20px]" />}
                </motion.button>
              </div>
            </div>

            {/* Agreement */}
            <div>
              <label className="flex items-start gap-[8px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                  className="size-[18px] rounded-[3px] bg-[#1c2534] border-2 border-[rgba(245,245,245,0.6)] checked:bg-[#637ffc] checked:border-[#637ffc] cursor-pointer mt-[2px] flex-shrink-0"
                  required
                />
                <span className="text-[14px] text-[rgba(255,255,255,0.8)]">
                  我已阅读并同意 
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    className="text-[#637ffc] hover:text-[#7389fd] mx-[4px]"
                  >
                    用户协议
                  </motion.button>
                  和
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    className="text-[#637ffc] hover:text-[#7389fd] ml-[4px]"
                  >
                    隐私政策
                  </motion.button>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#637ffc] rounded-[10px] h-[48px] text-[16px] text-white hover:bg-[#7389fd] transition-colors flex items-center justify-center"
            >
              注册
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(255,255,255,0.2)]"></div>
              </div>
              <div className="relative flex justify-center text-[12px]">
                <span className="bg-[#2d394b] px-[16px] text-[rgba(255,255,255,0.6)]">或</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-[14px] text-[rgba(255,255,255,0.6)]">已有账号？</span>
              <motion.button
                type="button"
                onClick={() => onNavigate('login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-[8px] text-[14px] text-[#637ffc] hover:text-[#7389fd]"
              >
                立即登录
              </motion.button>
            </div>
          </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
