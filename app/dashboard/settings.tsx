import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Platform } from 'react-native';
import { 
  Percent, Bell, Globe, Shield, 
  ChevronRight, Save, Settings as SettingsIcon,
  CreditCard, Smartphone, Lock, User,
  ArrowRight, Info
} from 'lucide-react-native';

const C = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#F1F5F9',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  accent: '#F8FAFC',
};

const TABS = [
  { id: 'general', label: 'Comisiones', icon: Percent },
  { id: 'notifs', label: 'Notificaciones', icon: Bell },
  { id: 'platform', label: 'Plataforma', icon: Globe },
  { id: 'security', label: 'Seguridad', icon: Shield },
];

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('general');
  const [notifs, setNotifs] = useState(true);
  const [mfa, setMfa] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
      
      {/* ─── Header Compacto ─── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Configuración</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 4, fontWeight: '500' }}>Ajustes globales del motor de Trabbitt.</Text>
        </View>

        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center', backgroundColor: C.textDark,
          paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
          shadowColor: C.textDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5
        }}>
           <Save size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 10 }} />
           <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Horizontal Segmented Controls (Premium SaaS Tabs) ─── */}
      <View style={{ 
        flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 6, borderRadius: 18, 
        alignSelf: 'flex-start', marginBottom: 40, gap: 4
      }}>
        {TABS.map((tab) => {
          const isSel = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <TouchableOpacity 
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14,
                backgroundColor: isSel ? '#FFFFFF' : 'transparent',
                shadowColor: isSel ? '#000' : 'transparent', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { height: 4, width: 0 }
              }}
            >
              <Icon size={16} color={isSel ? C.primary : C.textMuted} strokeWidth={2.5} />
              <Text style={{ marginLeft: 10, color: isSel ? C.textDark : C.textMuted, fontSize: 14, fontWeight: '800' }}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ─── Bento Form Card ─── */}
      <View style={{ flexDirection: 'row', gap: 32 }}>
        
        {/* Main Configuration Area */}
        <View style={{ flex: 2 }}>
           <View style={{ 
              backgroundColor: C.surface, borderRadius: 32, padding: 40,
              shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
              borderWidth: 1, borderColor: C.border
           }}>
              {activeTab === 'general' && (
                <View>
                   <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark, marginBottom: 24 }}>Comisiones del Ecosistema</Text>
                   
                   <View style={{ gap: 24 }}>
                      <View>
                        <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 }}>COMISIÓN HUÉSPED (%)</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                           <Percent size={16} color={C.textMuted} />
                           <TextInput value="10" style={{ flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '700', outlineStyle: 'none' }} />
                        </View>
                        <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 6 }}>Se aplica automáticamente al checkout del usuario.</Text>
                      </View>

                      <View>
                        <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 }}>COMISIÓN ANFITRIÓN (%)</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                           <Percent size={16} color={C.textMuted} />
                           <TextInput value="8" style={{ flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '700', outlineStyle: 'none' }} />
                        </View>
                        <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 6 }}>Deducido del monto total al procesar el retiro cobrado.</Text>
                      </View>

                      <View>
                        <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 }}>MONEDA BASE</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                           <CreditCard size={16} color={C.textMuted} />
                           <Text style={{ flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '700' }}>Quetzal Guatemalteco (GTQ)</Text>
                           <ChevronRight size={16} color={C.textMuted} />
                        </TouchableOpacity>
                      </View>
                   </View>
                </View>
              )}

              {activeTab === 'notifs' && (
                <View>
                   <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark, marginBottom: 24 }}>Preferencias de Notificación</Text>
                   <View style={{ gap: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                         <View style={{ flex: 1 }}>
                            <Text style={{ color: C.textDark, fontSize: 15, fontWeight: '800' }}>Alertas de Reservas</Text>
                            <Text style={{ color: C.textMuted, fontSize: 12 }}>Notificar cuando un huésped reserva una propiedad.</Text>
                         </View>
                         <Switch value={notifs} onValueChange={setNotifs} trackColor={{ false: '#E2E8F0', true: `${C.primary}33` }} thumbColor={notifs ? C.primary : '#94A3B8'} />
                      </View>
                      <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
                         <View style={{ flex: 1 }}>
                            <Text style={{ color: C.textDark, fontSize: 15, fontWeight: '800' }}>Reportes de Ingresos</Text>
                            <Text style={{ color: C.textMuted, fontSize: 12 }}>Resumen semanal de ganancias vía correo electrónico.</Text>
                         </View>
                         <Switch value={true} trackColor={{ false: '#E2E8F0', true: `${C.primary}33` }} thumbColor={C.primary} />
                      </View>
                   </View>
                </View>
              )}

              {activeTab === 'platform' && (
                <View>
                   <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark, marginBottom: 24 }}>Cuerpo de la Plataforma</Text>
                   <View style={{ gap: 24 }}>
                      <View>
                        <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 8 }}>IDIOMA PRINCIPAL</Text>
                        <TouchableOpacity style={{ backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                           <Text style={{ fontSize: 14, fontWeight: '700' }}>Español (Guatemala)</Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 8 }}>TIMEZONE</Text>
                        <TouchableOpacity style={{ backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                           <Text style={{ fontSize: 14, fontWeight: '700' }}>GMT-6 (Central America)</Text>
                        </TouchableOpacity>
                      </View>
                   </View>
                </View>
              )}

              {activeTab === 'security' && (
                <View>
                   <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark, marginBottom: 24 }}>Seguridad Avanzada</Text>
                   <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#FEE2E2' }}>
                      <Shield size={24} color="#EF4444" />
                      <View style={{ marginLeft: 16, flex: 1 }}>
                         <Text style={{ color: '#991B1B', fontSize: 14, fontWeight: '800' }}>2FA Desactivado</Text>
                         <Text style={{ color: '#B91C1C', fontSize: 12, opacity: 0.8 }}>Recomendamos activar la autenticación de dos pasos para proteger el panel.</Text>
                      </View>
                      <TouchableOpacity style={{ backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
                         <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>ACTIVAR</Text>
                      </TouchableOpacity>
                   </View>
                </View>
              )}
           </View>
        </View>

        {/* Info & Support Sidebar */}
        <View style={{ flex: 1, gap: 24 }}>
           <View style={{ backgroundColor: '#10B981', padding: 24, borderRadius: 32, shadowColor: '#10B981', shadowOpacity: 0.2, shadowRadius: 15, elevation: 5 }}>
              <Info size={24} color="#FFFFFF" style={{ marginBottom: 16 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900', marginBottom: 8 }}>Ayuda Rápida</Text>
              <Text style={{ color: '#FFFFFF', opacity: 0.8, fontSize: 13, lineHeight: 20, marginBottom: 20 }}>Toda modificación de comisiones afecta directamente a los cálculos de reservas vigentes y futuras automáticamente.</Text>
              <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
                 <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Leer Documentación</Text>
              </TouchableOpacity>
           </View>
           
           <View style={{ backgroundColor: '#F8FAFC', padding: 24, borderRadius: 32, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ color: C.textDark, fontSize: 16, fontWeight: '900', marginBottom: 12 }}>Control Maestro</Text>
              <Text style={{ color: C.textMuted, fontSize: 12, lineHeight: 18, marginBottom: 20 }}>Tienes acceso total a la infraestructura. Las modificaciones en moneda o base de datos afectan a todo el ecosistema de Trabbitt en tiempo real.</Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 13 }}>Logs de Sistema</Text>
                 <ArrowRight size={14} color={C.textDark} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
           </View>
        </View>

      </View>

    </ScrollView>
  );
}
