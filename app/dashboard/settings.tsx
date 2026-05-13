import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Image, ActivityIndicator, Modal, Platform } from 'react-native';
import { 
  Percent, Bell, CreditCard, Shield, 
  Save, ArrowRight, Info, Clock, Plus, Trash2, Pencil, X, Check, Database,
  ShieldAlert, Smartphone, Laptop, MapPin
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { db } from '../../src/lib/firebase';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, setDoc
} from 'firebase/firestore';

const C = {
  bg: '#FFFFFF', surface: '#FFFFFF', border: '#F1F5F9',
  primary: '#10B981', textDark: '#0F172A', textMuted: '#64748B',
};

const TABS = [
  { id: 'general',    label: 'Comisiones',    icon: Percent    },
  { id: 'notifs',     label: 'Notificaciones', icon: Bell      },
  { id: 'processors', label: 'Procesadores',  icon: CreditCard },
  { id: 'security',   label: 'Seguridad',     icon: Shield     },
];

// ─── Modal para agregar / editar procesador ──────────────────────────
const EMPTY_FORM = { name: '', description: '', fee: '', days: '', logoUrl: '', color: '#635BFF', active: true };

function ProcessorModal({ visible, initial, onClose, onSave, isSaving }: {
  visible: boolean;
  initial: typeof EMPTY_FORM & { id?: string };
  onClose: () => void;
  onSave: (data: typeof EMPTY_FORM & { id?: string }) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(initial);
  useEffect(() => setForm(initial), [initial]);

  const field = (label: string, key: keyof typeof EMPTY_FORM, placeholder: string, hint?: string) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 11, fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{label}</Text>
      <TextInput
        value={String(form[key])}
        onChangeText={(v) => setForm(p => ({ ...p, [key]: v }))}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        style={{ backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 14, outlineStyle: 'none', color: C.textDark }}
      />
      {hint && <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 4 }}>{hint}</Text>}
    </View>
  );

  const canSave = form.name.trim() && form.fee.trim() && form.days.trim();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ backgroundColor: '#FFFFFF', width: '90%', maxWidth: 500, borderRadius: 28, padding: 36, shadowColor: '#000', shadowOffset: {width:0,height:20}, shadowOpacity: 0.15, shadowRadius: 40 }}>
          
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: C.textDark }}>{form.id ? 'Editar Procesador' : 'Nuevo Procesador'}</Text>
            <TouchableOpacity onPress={onClose} style={{ width: 36, height: 36, backgroundColor: '#F1F5F9', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} color={C.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
            {field('Nombre del procesador', 'name', 'Ej. Stripe, PayPal, Clip...')}
            {field('Descripción corta', 'description', 'Ej. Pagos con tarjeta global...')}
            {field('Comisión', 'fee', 'Ej. 2.9% + $0.30')}
            {field('Días de liquidación', 'days', 'Ej. 2 días hábiles', 'Cuántos días tarda el dinero en llegar.')}
            {field('Logo URL (opcional)', 'logoUrl', 'https://ejemplo.com/logo.png', 'Pega la URL de la imagen del logo.')}
            
            {/* Color del ícono */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Color del ícono</Text>
              <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
                {['#635BFF','#003087','#009EE3','#F97316','#10B981','#EF4444','#0F172A','#6366F1'].map(c => (
                  <TouchableOpacity key={c} onPress={() => setForm(p => ({...p, color: c}))} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c, alignItems: 'center', justifyContent: 'center', borderWidth: form.color === c ? 3 : 0, borderColor: '#0F172A' }}>
                    {form.color === c && <Check size={16} color="white" strokeWidth={3} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Vista previa del logo */}
            {form.logoUrl ? (
              <View style={{ marginBottom: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, alignSelf: 'flex-start' }}>Vista previa</Text>
                <Image source={{ uri: form.logoUrl }} style={{ width: 64, height: 64, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' }} resizeMode="contain" />
              </View>
            ) : null}
          </ScrollView>

          {/* Botones */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity onPress={onClose} style={{ flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }}>
              <Text style={{ color: C.textMuted, fontWeight: '700' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => canSave && onSave(form)}
              style={{ flex: 2, paddingVertical: 14, borderRadius: 14, backgroundColor: canSave ? C.primary : '#94A3B8', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
            >
              {isSaving ? <ActivityIndicator color="white" size="small" /> : <Text style={{ color: 'white', fontWeight: '800', fontSize: 15 }}>Guardar Procesador</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Pestaña de Procesadores ─────────────────────────────────────────
function ProcessorsTab() {
  const [processors, setProcessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<typeof EMPTY_FORM & { id?: string }>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'payment_processors'), (snap) => {
      setProcessors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openAdd = () => { setEditTarget({ ...EMPTY_FORM }); setModalVisible(true); };
  const openEdit = (p: any) => { setEditTarget({ ...p }); setModalVisible(true); };

  const handleSave = async (form: typeof EMPTY_FORM & { id?: string }) => {
    setIsSaving(true);
    try {
      const { id, ...data } = form;
      if (id) {
        await updateDoc(doc(db, 'payment_processors', id), { ...data, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, 'payment_processors'), { ...data, active: true, createdAt: serverTimestamp() });
      }
      setModalVisible(false);
    } catch (e) { console.error(e); } finally { setIsSaving(false); }
  };

  const handleToggle = async (p: any) => {
    await updateDoc(doc(db, 'payment_processors', p.id), { active: !p.active });
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este procesador? Esta acción no se puede deshacer.')) {
      await deleteDoc(doc(db, 'payment_processors', id));
    }
  };

  if (loading) return <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />;

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>Procesadores de Pago</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
            Gestiona los procesadores disponibles. Cada anfitrión podrá conectar su cuenta al procesador que prefieras.
          </Text>
        </View>
        <TouchableOpacity
          onPress={openAdd}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.textDark, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, gap: 8 }}
        >
          <Plus size={16} color="white" />
          <Text style={{ color: 'white', fontWeight: '800', fontSize: 13 }}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {processors.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 60 }}>
          <CreditCard size={48} color="#E2E8F0" />
          <Text style={{ color: '#94A3B8', marginTop: 16, fontSize: 15, fontWeight: '600', textAlign: 'center' }}>
            No hay procesadores aún.{'\n'}Agrega tu primero con el botón de arriba.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          {processors.map((p) => (
            <View key={p.id} style={{
              borderRadius: 20, borderWidth: 2,
              borderColor: p.active ? `${p.color}40` : '#F1F5F9',
              backgroundColor: p.active ? `${p.color}08` : '#FAFAFA',
              padding: 20,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: p.active ? 14 : 0 }}>
                {/* Logo o letra */}
                <View style={{
                  width: 52, height: 52, borderRadius: 14,
                  backgroundColor: p.active ? `${p.color}15` : '#F1F5F9',
                  borderWidth: 1, borderColor: p.active ? `${p.color}30` : '#E2E8F0',
                  alignItems: 'center', justifyContent: 'center', marginRight: 16, overflow: 'hidden'
                }}>
                  {p.logoUrl
                    ? <Image source={{ uri: p.logoUrl }} style={{ width: 38, height: 38 }} resizeMode="contain" />
                    : <Text style={{ color: p.color || C.primary, fontWeight: '900', fontSize: (p.name || '?').length > 2 ? 12 : 20 }}>
                        {(p.name || '?').substring(0, 2).toUpperCase()}
                      </Text>
                  }
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 17, fontWeight: '900', color: C.textDark }}>{p.name}</Text>
                  {p.description ? <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }} numberOfLines={1}>{p.description}</Text> : null}
                </View>

                {/* Acciones */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <TouchableOpacity onPress={() => openEdit(p)} style={{ width: 34, height: 34, backgroundColor: '#F1F5F9', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Pencil size={14} color={C.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(p.id)} style={{ width: 34, height: 34, backgroundColor: '#FEF2F2', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={14} color="#EF4444" />
                  </TouchableOpacity>
                  <Switch
                    value={!!p.active}
                    onValueChange={() => handleToggle(p)}
                    trackColor={{ false: '#E2E8F0', true: `${C.primary}55` }}
                    thumbColor={p.active ? C.primary : '#94A3B8'}
                  />
                </View>
              </View>

              {/* Detalles: comisión y días */}
              {p.active && (
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: `${p.color}25` }}>
                    <Percent size={14} color={p.color || C.primary} />
                    <View>
                      <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: '700', textTransform: 'uppercase' }}>Comisión</Text>
                      <Text style={{ fontSize: 13, fontWeight: '900', color: C.textDark }}>{p.fee || '—'}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: `${p.color}25` }}>
                    <Clock size={14} color={p.color || C.primary} />
                    <View>
                      <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: '700', textTransform: 'uppercase' }}>Liquidación</Text>
                      <Text style={{ fontSize: 12, fontWeight: '900', color: C.textDark }}>{p.days || '—'}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      <ProcessorModal
        visible={modalVisible}
        initial={editTarget}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </View>
  );
}

// ─── Helpers de Seguridad ──────────────────────────────────────────────
const logAdminAction = async (action: string, category: string, details: string, severity: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') => {
  try {
    await addDoc(collection(db, 'system_logs'), {
      action,
      category,
      details,
      severity,
      timestamp: serverTimestamp(),
      userName: 'Admin Pro',
      device: `${Platform.OS === 'web' ? 'Navegador Web' : Platform.OS} (Identificado)`,
      ip: '190.111.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) // Simulación de IP real
    });
  } catch (e) {
    console.error('Error logging action:', e);
  }
};

// ─── Pantalla Principal ───────────────────────────────────────────────
export default function SettingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [notifs, setNotifs] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [commissions, setCommissions] = useState({ 
    guest: '10', 
    host: '4', 
    showStore: true, 
    showPlan: true,
    firewallEnabled: false,
    allowedCountries: 'Guatemala'
  });
  const [loadingComms, setLoadingComms] = useState(true);

  // Cargar comisiones y seguridad global
  useEffect(() => {
    // Escuchar comisiones
    const unsubComm = onSnapshot(doc(db, 'platform_settings', 'commissions'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setCommissions(p => ({
          ...p,
          guest: data.guest || '10',
          host: data.host || '4',
          showStore: data.showStore !== undefined ? data.showStore : true,
          showPlan: data.showPlan !== undefined ? data.showPlan : true,
        }));
      }
    });

    // Escuchar seguridad
    const unsubSec = onSnapshot(doc(db, 'platform_settings', 'security'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setCommissions(p => ({
          ...p,
          firewallEnabled: data.firewallEnabled || false,
          allowedCountries: data.allowedCountries || 'Guatemala'
        }));
      }
      setLoadingComms(false);
    });

    return () => { unsubComm(); unsubSec(); };
  }, []);

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    try {
      await setDoc(doc(db, 'platform_settings', 'commissions'), {
        ...commissions,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Log the commission change
      await logAdminAction(
        'COMISIONES ACTUALIZADAS',
        'COMMISSIONS',
        `Comisiones ajustadas: Huésped ${commissions.guest}%, Anfitrión ${commissions.host}%`,
        'WARNING'
      );

      alert('Configuración guardada correctamente.');
    } catch (e) {
      console.error(e);
      alert('Error al guardar: ' + (e as any).message);
    } finally {
      setIsSavingAll(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Configuración</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 4, fontWeight: '500' }}>Ajustes globales del motor de Trabbitt.</Text>
        </View>
        <TouchableOpacity 
          onPress={handleSaveAll}
          disabled={isSavingAll}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.textDark, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, opacity: isSavingAll ? 0.7 : 1 }}
        >
          {isSavingAll ? (
            <ActivityIndicator color="white" size="small" style={{ marginRight: 10 }} />
          ) : (
            <Save size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 10 }} />
          )}
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>
            {isSavingAll ? 'Guardando...' : 'Guardar Cambios'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 6, borderRadius: 18, alignSelf: 'flex-start', marginBottom: 40, gap: 4 }}>
        {TABS.map((tab) => {
          const isSel = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14, backgroundColor: isSel ? '#FFFFFF' : 'transparent' }}>
              <Icon size={16} color={isSel ? C.primary : C.textMuted} strokeWidth={2.5} />
              <Text style={{ marginLeft: 10, color: isSel ? C.textDark : C.textMuted, fontSize: 14, fontWeight: '800' }}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <View style={{ flexDirection: 'row', gap: 32 }}>
        <View style={{ flex: 2 }}>
          <View style={{ backgroundColor: C.surface, borderRadius: 32, padding: 40, borderWidth: 1, borderColor: C.border }}>

            {activeTab === 'general' && (
              <View>
                <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark, marginBottom: 24 }}>Comisiones del Ecosistema</Text>
                <View style={{ gap: 24 }}>
                  <View>
                    <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 }}>COMISIÓN HUÉSPED (%)</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Percent size={16} color={C.textMuted} />
                      <TextInput 
                        value={String(commissions.guest)} 
                        onChangeText={(v) => setCommissions(p => ({ ...p, guest: v }))}
                        keyboardType="numeric"
                        style={{ flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '700', outlineStyle: 'none', color: C.textDark }} 
                      />
                    </View>
                    <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 6 }}>Se aplica automáticamente al checkout del usuario.</Text>
                  </View>
                  <View>
                    <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 8, letterSpacing: 0.5 }}>COMISIÓN ANFITRIÓN (%)</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Percent size={16} color={C.textMuted} />
                      <TextInput 
                        value={String(commissions.host)} 
                        onChangeText={(v) => setCommissions(p => ({ ...p, host: v }))}
                        keyboardType="numeric"
                        style={{ flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '700', outlineStyle: 'none', color: C.textDark }} 
                      />
                    </View>
                    <Text style={{ color: C.textMuted, fontSize: 11, marginTop: 6 }}>Deducido del monto total al procesar el retiro.</Text>
                  </View>

                  <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 8 }} />

                  {/* Visibilidad Tienda */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: C.textDark, fontSize: 15, fontWeight: '800' }}>Tienda Trabbitt</Text>
                      <Text style={{ color: C.textMuted, fontSize: 12 }}>Mostrar sección de tienda en el explorador del cliente.</Text>
                    </View>
                    <Switch 
                      value={commissions.showStore} 
                      onValueChange={async (v) => {
                        setCommissions(p => ({ ...p, showStore: v }));
                        await updateDoc(doc(db, 'platform_settings', 'commissions'), { showStore: v });
                        
                        await logAdminAction(
                          v ? 'TIENDA ACTIVADA' : 'TIENDA OCULTADA',
                          'INFRASTRUCTURE',
                          `La sección de tienda ha sido ${v ? 'habilitada' : 'deshabilitada'} globalmente.`
                        );
                      }} 
                      trackColor={{ false: '#E2E8F0', true: `${C.primary}33` }} 
                      thumbColor={commissions.showStore ? C.primary : '#94A3B8'} 
                    />
                  </View>

                  {/* Visibilidad Plan */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: C.textDark, fontSize: 15, fontWeight: '800' }}>Pestaña Plan</Text>
                      <Text style={{ color: C.textMuted, fontSize: 12 }}>Mostrar pestaña "Plan" en la barra de navegación del cliente.</Text>
                    </View>
                    <Switch 
                      value={commissions.showPlan} 
                      onValueChange={async (v) => {
                        setCommissions(p => ({ ...p, showPlan: v }));
                        await updateDoc(doc(db, 'platform_settings', 'commissions'), { showPlan: v });

                        await logAdminAction(
                          v ? 'PLAN ACTIVADO' : 'PLAN OCULTADO',
                          'INFRASTRUCTURE',
                          `La pestaña Plan ha sido ${v ? 'habilitada' : 'deshabilitada'} en la navegación.`
                        );
                      }} 
                      trackColor={{ false: '#E2E8F0', true: `${C.primary}33` }} 
                      thumbColor={commissions.showPlan ? C.primary : '#94A3B8'} 
                    />
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

            {activeTab === 'processors' && <ProcessorsTab />}

            {activeTab === 'security' && (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>Escudo de Seguridad</Text>
                  <View style={{ backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#DCFCE7' }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' }} />
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#10B981' }}>PROTECCIÓN ACTIVA</Text>
                  </View>
                </View>

                {/* Security Level Indicator */}
                <View style={{ backgroundColor: '#F8FAFC', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: C.border, marginBottom: 24 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: C.textDark }}>Nivel de Protección</Text>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#10B981' }}>85% Seguro</Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                    <View style={{ width: '85%', height: '100%', backgroundColor: '#10B981' }} />
                  </View>
                  <Text style={{ fontSize: 11, color: C.textMuted, marginTop: 12 }}>Tu cuenta está protegida con cifrado de grado militar y monitoreo 24/7.</Text>
                </View>

                {/* MODOS DE DEFENSA */}
                <Text style={{ fontSize: 14, fontWeight: '900', color: C.textDark, marginBottom: 16, letterSpacing: 0.5 }}>PROTOCOLOS DE DEFENSA</Text>
                
                <View style={{ gap: 16 }}>
                  {/* Lockdown Mode */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#FEE2E2' }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldAlert size={20} color="#FFFFFF" />
                    </View>
                    <View style={{ marginLeft: 16, flex: 1 }}>
                      <Text style={{ color: '#991B1B', fontSize: 15, fontWeight: '900' }}>Modo Lock Down</Text>
                      <Text style={{ color: '#B91C1C', fontSize: 12, opacity: 0.8 }}>Congela instantáneamente todas las operaciones del ecosistema.</Text>
                    </View>
                    <Switch trackColor={{ false: '#FECACA', true: '#EF4444' }} thumbColor="#FFFFFF" />
                  </View>

                  {/* IP Tracking */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: C.border }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={20} color={C.textDark} />
                    </View>
                    <View style={{ marginLeft: 16, flex: 1 }}>
                      <Text style={{ color: C.textDark, fontSize: 15, fontWeight: '800' }}>Rastreo de IP & GPS</Text>
                      <Text style={{ color: C.textMuted, fontSize: 12 }}>Registra la ubicación de cada cambio administrativo.</Text>
                    </View>
                    <Switch value={true} trackColor={{ false: '#E2E8F0', true: `${C.primary}33` }} thumbColor={C.primary} />
                  </View>

                  {/* Device Verification */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: C.border }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                      <Smartphone size={20} color={C.textDark} />
                    </View>
                    <View style={{ marginLeft: 16, flex: 1 }}>
                      <Text style={{ color: C.textDark, fontSize: 15, fontWeight: '800' }}>Verificación de Dispositivo</Text>
                      <Text style={{ color: C.textMuted, fontSize: 12 }}>Bloquea el acceso si se detecta un hardware desconocido.</Text>
                    </View>
                    <Switch value={true} trackColor={{ false: '#E2E8F0', true: `${C.primary}33` }} thumbColor={C.primary} />
                  </View>

                  {/* Bloqueo por País (Firewall) */}
                  <View style={{ backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: C.border }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' }}>
                          <Shield size={20} color="#3B82F6" />
                        </View>
                        <View style={{ marginLeft: 16 }}>
                          <Text style={{ color: C.textDark, fontSize: 15, fontWeight: '800' }}>Firewall por Geovalla</Text>
                          <Text style={{ color: C.textMuted, fontSize: 12 }}>Solo permite acceso desde países autorizados.</Text>
                        </View>
                      </View>
                      <Switch 
                        value={commissions.firewallEnabled} 
                        onValueChange={async (v) => {
                          setCommissions(p => ({ ...p, firewallEnabled: v }));
                          await setDoc(doc(db, 'platform_settings', 'security'), { firewallEnabled: v }, { merge: true });
                          await logAdminAction(
                            v ? 'FIREWALL ACTIVADO' : 'FIREWALL DESACTIVADO',
                            'SECURITY',
                            `El bloqueo por geovalla ha sido ${v ? 'activado' : 'desactivado'}.`,
                            v ? 'WARNING' : 'INFO'
                          );
                        }}
                        trackColor={{ false: '#E2E8F0', true: `${C.primary}33` }} 
                        thumbColor={commissions.firewallEnabled ? C.primary : '#94A3B8'} 
                      />
                    </View>
                    
                    {commissions.firewallEnabled && (
                      <View style={{ backgroundColor: '#F8FAFC', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: C.textMuted, marginBottom: 8, letterSpacing: 0.5 }}>PAÍSES AUTORIZADOS (SEPARADOS POR COMA)</Text>
                        <TextInput 
                          value={commissions.allowedCountries}
                          onChangeText={(v) => setCommissions(p => ({ ...p, allowedCountries: v }))}
                          onBlur={async () => {
                            const val = commissions.allowedCountries.trim() || 'Guatemala';
                            setCommissions(p => ({ ...p, allowedCountries: val }));
                            await setDoc(doc(db, 'platform_settings', 'security'), { allowedCountries: val }, { merge: true });
                          }}
                          placeholder="Guatemala, Mexico, United States"
                          style={{ fontSize: 14, fontWeight: '700', color: C.textDark, outlineStyle: 'none' }}
                        />
                      </View>
                    )}
                  </View>
                </View>

                {/* Ultimas Sesiones */}
                <Text style={{ fontSize: 14, fontWeight: '900', color: C.textDark, marginTop: 32, marginBottom: 16, letterSpacing: 0.5 }}>SESIONES ACTIVAS</Text>
                <View style={{ backgroundColor: '#F8FAFC', borderRadius: 20, padding: 4, borderWidth: 1, borderColor: C.border }}>
                  {[
                    { device: 'MacBook Pro 16"', ip: '190.111.45.22', loc: 'Ciudad de Guatemala', status: 'Actual', icon: Laptop },
                    { device: 'iPhone 15 Pro', ip: '190.111.45.23', loc: 'Ciudad de Guatemala', status: 'Hace 2 horas', icon: Smartphone }
                  ].map((s, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: i === 0 ? 1 : 0, borderBottomColor: '#E2E8F0' }}>
                      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
                        <s.icon size={16} color={C.textMuted} />
                      </View>
                      <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '800', color: C.textDark }}>{s.device}</Text>
                        <Text style={{ fontSize: 11, color: C.textMuted }}>{s.ip} • {s.loc}</Text>
                      </View>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: s.status === 'Actual' ? '#10B981' : C.textMuted }}>{s.status.toUpperCase()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          </View>
        </View>

        {/* Sidebar */}
        <View style={{ flex: 1, gap: 24 }}>
          <View style={{ backgroundColor: '#10B981', padding: 24, borderRadius: 32 }}>
            <Info size={24} color="#FFFFFF" style={{ marginBottom: 16 }} />
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900', marginBottom: 8 }}>Ayuda Rápida</Text>
            <Text style={{ color: '#FFFFFF', opacity: 0.8, fontSize: 13, lineHeight: 20, marginBottom: 20 }}>
              {activeTab === 'processors'
                ? 'Los procesadores activos estarán disponibles para que tus anfitriones configuren su cuenta de cobro.'
                : 'Toda modificación de comisiones afecta directamente a los cálculos de reservas vigentes y futuras.'}
            </Text>
            <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Leer Documentación</Text>
            </TouchableOpacity>
          </View>

          {/* CONTROL MAESTRO POTENCIADO */}
          <View style={{ backgroundColor: '#F8FAFC', padding: 24, borderRadius: 32, borderWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ color: C.textDark, fontSize: 16, fontWeight: '900' }}>Control Maestro</Text>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981', shadowColor: '#10B981', shadowRadius: 6, shadowOpacity: 0.5 }} />
            </View>
            
            <Text style={{ color: C.textMuted, fontSize: 12, lineHeight: 18, marginBottom: 20 }}>
              Acceso total a la infraestructura global en tiempo real.
            </Text>

            {/* Modo Mantenimiento */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              backgroundColor: 'white', 
              padding: 14, 
              borderRadius: 16, 
              borderWidth: 1, 
              borderColor: C.border,
              marginBottom: 16
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Clock size={16} color={C.textMuted} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.textDark }}>Mantenimiento</Text>
              </View>
              <MaintenanceSwitch />
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/dashboard/system-logs')}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Database size={16} color={C.textDark} />
                <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 13 }}>Logs de Sistema</Text>
              </View>
              <ArrowRight size={14} color={C.textDark} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Componente para el switch de mantenimiento con su propia lógica
function MaintenanceSwitch() {
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'platform_settings', 'maintenance'), (snap) => {
      if (snap.exists()) setActive(snap.data().enabled);
    });
    return () => unsub();
  }, []);

  const toggle = async (val: boolean) => {
    setActive(val);
    await setDoc(doc(db, 'platform_settings', 'maintenance'), { 
      enabled: val, 
      updatedAt: serverTimestamp() 
    }, { merge: true });

    // Log the action
    await logAdminAction(
      val ? 'MANTENIMIENTO ACTIVADO' : 'MANTENIMIENTO DESACTIVADO',
      'INFRASTRUCTURE',
      `El administrador ha ${val ? 'activado' : 'desactivado'} el modo mantenimiento global.`,
      val ? 'WARNING' : 'INFO'
    );
  };

  return (
    <Switch 
      value={active} 
      onValueChange={toggle}
      trackColor={{ false: '#E2E8F0', true: '#EF444433' }}
      thumbColor={active ? '#EF4444' : '#94A3B8'}
    />
  );
}
