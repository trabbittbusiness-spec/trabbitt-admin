import { Drawer } from 'expo-router/drawer';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  CreditCard,
  Settings,
  Camera,
  BarChart3,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const IS_WEB_WIDE = Platform.OS === 'web' && width >= 768;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/(dashboard)/home' },
  { label: 'Owners', icon: Users, href: '/(dashboard)/owners' },
  { label: 'Usuarios', icon: Building2, href: '/(dashboard)/users' },
  { label: 'Anuncios', icon: Camera, href: '/(dashboard)/listings' },
  { label: 'Retiros', icon: CreditCard, href: '/(dashboard)/withdrawals' },
  { label: 'Reportes', icon: BarChart3, href: '/(dashboard)/reports' },
  { label: 'Chat', icon: MessageSquare, href: '/(dashboard)/chat' },
  { label: 'Ajustes', icon: Settings, href: '/(dashboard)/settings' },
];

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="flex-1 bg-sidebar pt-14 pb-6">
      {/* Logo */}
      <View className="px-5 mb-10">
        <View className="flex-row items-center gap-2">
          <View className="w-9 h-9 rounded-xl bg-primary items-center justify-center">
            <Sparkles size={18} color="#fff" strokeWidth={2.5} />
          </View>
          <View className="ml-2">
            <Text className="text-white font-black text-base tracking-wider">TRABBITT</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '700', letterSpacing: 3 }}>ADMIN</Text>
          </View>
        </View>
      </View>

      {/* Nav Items */}
      <View className="flex-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href.replace('/(dashboard)', ''));
          return (
            <TouchableOpacity
              key={item.href}
              onPress={() => router.push(item.href as any)}
              activeOpacity={0.7}
              className={`flex-row items-center px-4 py-3.5 rounded-2xl mb-1 ${isActive ? 'bg-white/10' : ''}`}
            >
              <Icon
                size={19}
                color={isActive ? '#00BFA5' : 'rgba(255,255,255,0.4)'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <Text
                className="ml-3 font-semibold flex-1"
                style={{
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize: 13,
                }}
              >
                {item.label}
              </Text>
              {isActive && <ChevronRight size={14} color="#00BFA5" strokeWidth={2.5} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Profile */}
      <View className="px-4">
        <View className="border-t border-white/8 pt-4">
          <TouchableOpacity className="flex-row items-center px-2" activeOpacity={0.7}>
            <View className="w-9 h-9 rounded-full bg-primary/20 items-center justify-center border border-primary/30">
              <Text className="text-primary font-black text-sm">A</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-white font-bold text-sm">Super Admin</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>admin@trabbitt.com</Text>
            </View>
            <LogOut size={16} color="rgba(255,255,255,0.3)" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function DashboardLayout() {
  return (
    <Drawer
      drawerContent={() => <Sidebar />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#0D0D1A',
          width: IS_WEB_WIDE ? 240 : 280,
        },
        sceneStyle: {
          backgroundColor: '#0A0A0F',
        },
        drawerType: IS_WEB_WIDE ? 'permanent' : 'front',
        overlayColor: 'rgba(0,0,0,0.6)',
      }}
    />
  );
}
