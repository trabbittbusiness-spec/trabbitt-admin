import React, { useState, createContext } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Platform
} from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LayoutDashboard, Users, Building2, CalendarCheck,
  DollarSign, ShieldCheck, UserCheck, Briefcase,
  Image as ImageIcon, BarChart3, Headphones,
  Settings, Bell, Search, Menu, Command, Sparkles
} from 'lucide-react-native';

// ─── Theme: Startup Unicorn (Vibrant Mint + Solid Core) 
const T = {
  bg: '#F7F9FA',            // Ultra clean App Canvas
  surface: '#FFFFFF',       // Panels
  border: '#EDF2F7',        // Crisp thin structural lines
  
  brandDark: '#0F172A',     // Pure Startup Slate (Almost black)
  brandGray: '#64748B',     // Tech Gray for inactive text
  
  // The "Super Unique" Gradient for the Selector
  gradStart: '#2DD4BF',     // Vibrant Cyan/Mint
  gradEnd: '#10B981',       // Deep Emerald Green
};

const NAV = [
  { label: 'Resumen',        icon: LayoutDashboard,  href: '/dashboard' },
  { label: 'Anfitriones',    icon: Users,            href: '/dashboard/hosts' },
  { label: 'Anuncios',       icon: Building2,        href: '/dashboard/properties' },
  { label: 'Reservas',       icon: CalendarCheck,    href: '/dashboard/bookings' },
  { label: 'Finanzas',       icon: DollarSign,       href: '/dashboard/finances' },
  { label: 'Validaciones',   icon: ShieldCheck,      href: '/dashboard/validations' },
  { label: 'Clientes',       icon: UserCheck,        href: '/dashboard/clients' },
  { label: 'Servicios Pro',  icon: Briefcase,        href: '/dashboard/services' },
  { label: 'Analytics',      icon: BarChart3,        href: '/dashboard/analytics' },
  { label: 'Soporte',        icon: Headphones,       href: '/dashboard/support' },
  { label: 'Configuración',  icon: Settings,         href: '/dashboard/settings' },
];

const SidebarCtx = createContext<{ collapsed: boolean; toggle: () => void }>({ collapsed: false, toggle: () => {} });

// ─── Startup Sidebar ──────────────────────────────
function Sidebar({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const W = collapsed ? 84 : 280;

  return (
    <View style={{
      width: W, backgroundColor: T.surface,
      height: '100%', paddingTop: Platform.OS === 'web' ? 24 : 48,
      shadowColor: T.brandDark, shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 10,
      zIndex: 20,
    }}>
      {/* Brand Header */}
      <View style={{
        paddingHorizontal: collapsed ? 0 : 28, marginBottom: 40,
        alignItems: 'center', flexDirection: 'row',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <LinearGradient
          colors={[T.gradStart, T.gradEnd]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', shadowColor: T.gradEnd, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
        >
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20 }}>T</Text>
        </LinearGradient>
        {!collapsed && (
          <Text style={{ marginLeft: 14, color: T.brandDark, fontWeight: '900', fontSize: 24, letterSpacing: -1 }}>Trabbitt</Text>
        )}
      </View>

      {/* Navigation */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: collapsed ? 12 : 20 }}>
        {!collapsed && <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '800', paddingHorizontal: 12, marginBottom: 12, letterSpacing: 1.5 }}>PLATAFORMA</Text>}
        
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <TouchableOpacity
              key={item.href}
              onPress={() => router.push(item.href as any)}
              activeOpacity={0.8}
              style={{ marginBottom: 6 }}
            >
              {isActive ? (
                // SUPER UNIQUE GRADIENT SELECTOR
                <LinearGradient
                  colors={[T.gradStart, T.gradEnd]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    paddingVertical: 12, paddingHorizontal: collapsed ? 0 : 16,
                    borderRadius: 14,
                    // Glowing Green Drop Shadow
                    shadowColor: T.gradEnd, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                  }}
                >
                  <Icon size={20} color="#FFFFFF" strokeWidth={2.5} />
                  {!collapsed && (
                    <Text style={{
                      marginLeft: 14, fontSize: 15, fontWeight: '800', // Extra bold text for active
                      color: '#FFFFFF',
                    }}>
                      {item.label}
                    </Text>
                  )}
                  {!collapsed && (
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Sparkles size={14} color="#FFFFFF" strokeWidth={2} />
                    </View>
                  )}
                </LinearGradient>
              ) : (
                // INACTIVE STATE
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingVertical: 12, paddingHorizontal: collapsed ? 0 : 16,
                  borderRadius: 14, backgroundColor: 'transparent',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}>
                  <Icon size={20} color={T.brandGray} strokeWidth={2} />
                  {!collapsed && (
                    <Text style={{
                      marginLeft: 14, fontSize: 15, fontWeight: '600',
                      color: T.brandGray,
                    }}>
                      {item.label}
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modern Startup Footer */}
      <View style={{ padding: 24, borderTopWidth: 1, borderTopColor: T.border }}>
        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: T.brandDark, fontWeight: '900', fontSize: 15 }}>A</Text>
          </View>
          {!collapsed && (
            <View style={{ marginLeft: 14 }}>
              <Text style={{ color: T.brandDark, fontSize: 14, fontWeight: '800' }}>Admin Pro</Text>
              <Text style={{ color: T.brandGray, fontSize: 12, fontWeight: '500' }}>Plan Enterprise</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Pro-Grade Solid TopBar ───────────────────────
function TopBar({ onMenuPress, title }: { onMenuPress: () => void; title: string }) {
  return (
    <View style={{ zIndex: 10 }}>
      <View style={{
        height: 72, flexDirection: 'row', alignItems: 'center',
        backgroundColor: T.surface, paddingHorizontal: 32,
        shadowColor: T.brandDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 8,
      }}>
        
        {/* Burger & Title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 280 }}>
          <TouchableOpacity onPress={onMenuPress} style={{ marginRight: 20, padding: 8, backgroundColor: '#F1F5F9', borderRadius: 8 }}>
            <Menu size={20} color={T.brandDark} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ color: T.brandDark, fontWeight: '900', fontSize: 22, letterSpacing: -0.5 }}>{title}</Text>
        </View>
        
        {/* Command Palette Search Box (Startup staple) */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: '#F8FAFC', borderRadius: 8,
            paddingHorizontal: 16, paddingVertical: 10,
            borderWidth: 1, borderColor: '#E2E8F0',
            width: '100%', maxWidth: 400
          }}>
            <Search size={16} color={T.brandGray} strokeWidth={2.5} />
            <Text style={{ color: '#94A3B8', fontSize: 14, marginLeft: 12, fontWeight: '600' }}>Buscar inquilinos, reservas...</Text>
            
            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <Command size={10} color="#94A3B8" strokeWidth={3} />
              <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '800', marginLeft: 4 }}>K</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Center */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity style={{
            width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFFFFF',
            borderWidth: 1, borderColor: T.border,
            alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <Bell size={20} color={T.brandDark} strokeWidth={2} />
            <View style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: T.gradStart }} />
          </TouchableOpacity>
        </View>

      </View>

      {/* The Magical Gradient Bottom Border of the Topbar */}
      <LinearGradient 
        colors={[T.gradStart, T.gradEnd, '#3B82F6', T.border]} 
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
        style={{ height: 2, width: '100%', opacity: 0.8 }} 
      />
    </View>
  );
}

// ─── Layout Shell ───────────────────────────────────
export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const activeNav = NAV.find(n => pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href)));
  const title = activeNav?.label ?? 'Dashboard';
  const isWide = Platform.OS === 'web';

  return (
    <SidebarCtx.Provider value={{ collapsed, toggle: () => setCollapsed(v => !v) }}>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: T.bg }}>
        
        {/* Sidebar */}
        {isWide && <Sidebar collapsed={collapsed} />}
        
        {/* Main Content Area */}
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {/* TopBar unequivocally touching the top */}
          <TopBar onMenuPress={() => setCollapsed(v => !v)} title={title} />
          
          <View style={{ flex: 1, overflow: 'hidden' }}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }} />
          </View>
        </View>

      </View>
    </SidebarCtx.Provider>
  );
}
