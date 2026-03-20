import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Network, 
  Zap, 
  ChevronRight, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Youtube, 
  MessageCircle, 
  ArrowRight,
  Monitor,
  Lock,
  Wifi,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc,
  getDoc,
  setDoc,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { db, auth } from './firebase';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Portfolio {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  createdAt: any;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: any;
}

interface Inquiry {
  id: string;
  name: string;
  contact: string;
  content: string;
  attachmentUrl?: string;
  createdAt: any;
}

// --- Components ---

const Navbar = ({ isAdmin, onAdminClick }: { isAdmin: boolean, onAdminClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '회사소개', href: '#about' },
    { name: '주요서비스', href: '#services' },
    { name: '포트폴리오', href: '#portfolio' },
    { name: '공지사항', href: '#notices' },
    { name: '견적문의', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-red-600 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
            <Shield className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">이안정보통신</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-white/70 hover:text-red-500 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onAdminClick}
            className="p-2 text-white/50 hover:text-red-500 transition-colors"
          >
            <SettingsIcon size={18} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium text-white/70"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => { onAdminClick(); setIsMenuOpen(false); }}
                className="flex items-center gap-2 text-white/50"
              >
                <SettingsIcon size={18} /> 관리자
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
      <img 
        src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=1920" 
        alt="Security Infrastructure"
        className="w-full h-full object-cover opacity-50"
        referrerPolicy="no-referrer"
      />
    </div>
    
    <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block px-4 py-1 rounded-full bg-red-600/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-6 border border-red-500/30">
          Professional Security & Network
        </span>
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none">
          안전을 넘어 <br /> <span className="text-red-600">신뢰를 연결합니다</span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          이안정보통신은 최첨단 CCTV 보안 솔루션과 고성능 네트워크 인프라 구축을 통해 
          귀하의 비즈니스와 소중한 자산을 완벽하게 보호합니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contact" className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 group">
            무료 견적 상담 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#services" className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10">
            서비스 둘러보기
          </a>
        </div>
      </motion.div>
    </div>

    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
      <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
        <div className="w-1 h-2 bg-red-500 rounded-full" />
      </div>
    </div>
  </section>
);

const Services = () => {
  const services = [
    {
      icon: <Monitor className="text-red-500" size={32} />,
      title: "CCTV 보안 솔루션",
      desc: "고화질 IP 카메라, 지능형 영상 분석, 원격 모니터링 시스템 구축으로 24시간 빈틈없는 보안을 제공합니다.",
      features: ["지능형 침입 감지", "야간 초고화질 감시", "모바일 실시간 확인"]
    },
    {
      icon: <Network className="text-red-500" size={32} />,
      title: "네트워크 인프라 공사",
      desc: "안정적인 비즈니스 환경을 위한 초고속 광랜, 무선 AP 최적화, 서버실 랙 정리 및 통합 배선 공사를 수행합니다.",
      features: ["통합 배선 시스템", "무선 네트워크 최적화", "서버실 인프라 구축"]
    },
    {
      icon: <Zap className="text-red-500" size={32} />,
      title: "정보통신 전문공사",
      desc: "아파트, 빌딩, 공장 등 대규모 현장의 정보통신 설비 및 유지보수를 전문 기술진이 책임지고 시공합니다.",
      features: ["구내 통신 설비", "방송 음향 시스템", "출입 통제 시스템"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">핵심 서비스</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-red-500/50 transition-all group"
            >
              <div className="mb-6 p-4 bg-red-600/10 rounded-xl inline-block group-hover:bg-red-600 transition-colors">
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
              <p className="text-white/60 mb-6 leading-relaxed">{s.desc}</p>
              <ul className="space-y-2">
                {s.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 size={16} className="text-red-500" /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PortfolioSection = ({ portfolios }: { portfolios: Portfolio[] }) => (
  <section id="portfolio" className="py-24 bg-zinc-950">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">시공 포트폴리오</h2>
          <p className="text-white/50">이안정보통신의 정밀한 기술력이 담긴 현장입니다.</p>
        </div>
        <div className="hidden md:block w-24 h-1 bg-red-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.length > 0 ? portfolios.map((p) => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5"
          >
            <img 
              src={p.imageUrl} 
              alt={p.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
              <span className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">{p.category}</span>
              <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
              <p className="text-white/60 text-sm line-clamp-2">{p.description}</p>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <p className="text-white/30">등록된 포트폴리오가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  </section>
);

const NoticeSection = ({ notices }: { notices: Notice[] }) => (
  <section id="notices" className="py-24 bg-black">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">공지사항</h2>
        <p className="text-white/50">이안정보통신의 새로운 소식을 전해드립니다.</p>
      </div>

      <div className="space-y-4">
        {notices.length > 0 ? notices.map((n) => (
          <div key={n.id} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">{n.title}</h3>
                  <p className="text-white/40 text-sm">{format(n.createdAt?.toDate() || new Date(), 'yyyy.MM.dd', { locale: ko })}</p>
                </div>
              </div>
              <ChevronRight className="text-white/20 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        )) : (
          <p className="text-center text-white/30 py-10">등록된 소식이 없습니다.</p>
        )}
      </div>
    </div>
  </section>
);

const InquiryForm = () => {
  const [formData, setFormData] = useState({ name: '', contact: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Save to Firestore (for admin dashboard)
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        createdAt: Timestamp.now()
      });

      // 2. Send to Formspree
      await fetch('https://formspree.io/f/xbdzwgoe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "성함/업체명": formData.name,
          "연락처": formData.contact,
          "문의내용": formData.content
        })
      });

      setSubmitted(true);
      setFormData({ name: '', contact: '', content: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">견적 문의</h2>
            <p className="text-white/60 mb-12 leading-relaxed">
              공사 규모에 상관없이 친절하게 상담해 드립니다. <br />
              전문 기술진이 현장을 직접 방문하여 최적의 솔루션을 제안합니다.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center text-red-500">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">대표번호</p>
                  <p className="text-xl font-bold">031-375-8230</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center text-red-500">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">이메일</p>
                  <p className="text-xl font-bold">eastar1974@naver.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center text-red-500">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">주소</p>
                  <p className="text-xl font-bold">경기도 오산시 밀머리로 64, 다짐프라자 310호</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">문의가 접수되었습니다</h3>
                <p className="text-white/50 mb-8">빠른 시일 내에 담당자가 연락드리겠습니다.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  새 문의 작성
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">성함/업체명</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none transition-colors"
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">연락처</label>
                    <input 
                      required
                      type="text" 
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none transition-colors"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">문의내용</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-red-500 outline-none transition-colors resize-none"
                    placeholder="공사 종류, 지역 등 상세 내용을 적어주세요."
                  />
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? "전송 중..." : "상담 신청하기"} <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-black border-t border-white/10 py-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center rounded-md">
              <Shield className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-white">이안정보통신</span>
          </div>
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            이안정보통신은 다년간의 현장 경험과 전문 기술력을 바탕으로 
            고객의 안전과 비즈니스 효율을 극대화하는 최상의 솔루션을 제공합니다.
            정보통신공사 면허 보유 업체로서 책임 시공을 약속드립니다.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-white/40">
            <li><a href="#about" className="hover:text-red-500 transition-colors">회사소개</a></li>
            <li><a href="#services" className="hover:text-red-500 transition-colors">주요서비스</a></li>
            <li><a href="#portfolio" className="hover:text-red-500 transition-colors">포트폴리오</a></li>
            <li><a href="#contact" className="hover:text-red-500 transition-colors">견적문의</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Social</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-red-600 hover:text-white transition-all">
              <MessageCircle size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-red-600 hover:text-white transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-red-600 hover:text-white transition-all">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
        <p>© 2026 (주)이안정보통신. All Rights Reserved.</p>
        <div className="flex gap-6">
          <span>사업자등록번호: 589-87-02900</span>
          <span>대표: 권민수</span>
        </div>
      </div>
    </div>
  </footer>
);

// --- Admin Dashboard ---

const AdminDashboard = ({ onClose }: { onClose: () => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolios' | 'notices' | 'inquiries'>('inquiries');
  const [data, setData] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, activeTab), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user, activeTab]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, activeTab, id));
    } catch (err) {
      alert('삭제 권한이 없습니다.');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, activeTab), {
        ...formData,
        createdAt: Timestamp.now()
      });
      setIsAdding(false);
      setFormData({});
    } catch (err) {
      alert('등록 권한이 없습니다.');
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 p-8 rounded-2xl border border-white/10 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">관리자 로그인</h2>
          <p className="text-white/50 mb-8 text-sm">이안정보통신 관리 시스템에 접속하려면 로그인하세요.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            Google 계정으로 로그인
          </button>
          <button onClick={onClose} className="mt-4 text-white/30 text-sm hover:text-white transition-colors">닫기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-zinc-950">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <SettingsIcon size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">관리자 대시보드</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40">{user.email}</span>
          <button onClick={handleLogout} className="p-2 text-white/40 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-zinc-950 p-4 hidden md:block">
          <nav className="space-y-2">
            {[
              { id: 'inquiries', name: '견적문의 관리', icon: <MessageCircle size={18} /> },
              { id: 'portfolios', name: '포트폴리오 관리', icon: <ImageIcon size={18} /> },
              { id: 'notices', name: '공지사항 관리', icon: <FileText size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id ? "bg-red-600 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                {activeTab === 'inquiries' ? '견적문의 내역' : activeTab === 'portfolios' ? '포트폴리오 목록' : '공지사항 목록'}
              </h2>
              {activeTab !== 'inquiries' && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus size={16} /> 신규 등록
                </button>
              )}
            </div>

            <div className="space-y-4">
              {data.map((item) => (
                <div key={item.id} className="p-6 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-between group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-bold">{item.title || item.name}</h3>
                      {item.category && <span className="text-[10px] px-2 py-0.5 bg-red-600/20 text-red-500 rounded-full font-bold uppercase">{item.category}</span>}
                    </div>
                    <p className="text-white/40 text-sm line-clamp-1">{item.content || item.description || item.contact}</p>
                    <span className="text-[10px] text-white/20 mt-2 block">{format(item.createdAt?.toDate() || new Date(), 'yyyy-MM-dd HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {data.length === 0 && <p className="text-center py-20 text-white/20 border-2 border-dashed border-white/5 rounded-xl">데이터가 없습니다.</p>}
            </div>
          </div>
        </main>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="max-w-lg w-full bg-zinc-900 p-8 rounded-2xl border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-6">신규 {activeTab === 'portfolios' ? '포트폴리오' : '공지사항'} 등록</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <input 
                  required
                  placeholder="제목"
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                {activeTab === 'portfolios' && (
                  <>
                    <input 
                      required
                      placeholder="카테고리 (CCTV, 네트워크 등)"
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                    <input 
                      required
                      placeholder="이미지 URL"
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500"
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    />
                  </>
                )}
                <textarea 
                  required
                  placeholder="내용"
                  rows={5}
                  className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500 resize-none"
                  onChange={(e) => setFormData({...formData, [activeTab === 'portfolios' ? 'description' : 'content']: e.target.value})}
                />
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-white/50 hover:text-white transition-colors">취소</button>
                  <button type="submit" className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">등록하기</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const qP = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
    const unsubscribeP = onSnapshot(qP, (snapshot) => {
      setPortfolios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Portfolio)));
    });

    const qN = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribeN = onSnapshot(qN, (snapshot) => {
      setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice)));
    });

    return () => {
      unsubscribeP();
      unsubscribeN();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      <Navbar isAdmin={false} onAdminClick={() => setIsAdminOpen(true)} />
      
      <main>
        <Hero />
        
        {/* About Section */}
        <section id="about" className="py-24 bg-zinc-950 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-red-600" />
                <img 
                  src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800" 
                  alt="Office" 
                  className="rounded-2xl shadow-2xl relative z-10"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-10 -right-10 bg-red-600 p-8 rounded-2xl z-20 hidden md:block">
                  <p className="text-4xl font-black text-white mb-1">20+</p>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Years Expertise</p>
                </div>
              </div>
              <div>
                <span className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4 block">About Ian IT</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                  기술과 신뢰로 <br /> <span className="text-red-600">미래를 연결합니다</span>
                </h2>
                <p className="text-white/60 mb-6 leading-relaxed text-lg">
                  (주)이안정보통신은 정보통신공사 전문 면허 보유 기업으로서, 지난 20여 년간 수많은 현장에서 쌓아온 풍부한 노하우와 독보적인 기술력을 자랑합니다.
                </p>
                <p className="text-white/40 mb-10 leading-relaxed text-sm">
                  우리는 아파트 단지, 대규모 공장, 오피스 빌딩, 공공기관 등 다양한 환경에 최적화된 맞춤형 인프라를 구축합니다. 
                  단순한 설비 설치를 넘어, 고객의 비즈니스 연속성을 보장하는 통합 솔루션을 설계하고 시공하며 철저한 사후 관리까지 책임지는 최고의 파트너가 될 것을 약속드립니다.
                </p>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-600/10 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">전문 면허 업체</h4>
                      <p className="text-xs text-white/40">정보통신공사업 면허를 보유한 신뢰할 수 있는 전문 기업입니다.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-600/10 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">베테랑 기술진</h4>
                      <p className="text-xs text-white/40">국가 공인 자격증을 갖춘 숙련된 전문가들이 전 공정을 책임집니다.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-600/10 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">다양한 시공 실적</h4>
                      <p className="text-xs text-white/40">공장, 아파트, 관공서 등 폭넓은 분야의 시공 경험을 보유하고 있습니다.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-red-600/10 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">철저한 유지보수</h4>
                      <p className="text-xs text-white/40">시공 후에도 신속하고 정확한 AS 시스템으로 고객 만족을 실현합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Services />
        <PortfolioSection portfolios={portfolios} />
        <NoticeSection notices={notices} />
        <InquiryForm />
      </main>

      <Footer />

      <AnimatePresence>
        {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
