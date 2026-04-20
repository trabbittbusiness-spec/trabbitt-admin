import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search, ShieldCheck, ShieldAlert, Clock, Filter, ChevronLeft, ChevronRight,
  MoreHorizontal, UserCheck, Building2, FileText, CheckCircle2, XCircle, Eye
} from 'lucide-react-native';

const C = {
  bg: '#FFFFFF',            
  card: '#FFFFFF',          
  primary: '#10B981',       
  mint: '#2DD4BF',          
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',   
};

const VALIDATION_KPIS = [
  { id: 1, title: 'Pendientes Hoy', value: '24', trend: '+12%', isPos: false, icon: Clock, color: '#F59E0B' },
  { id: 2, title: 'Verificados con éxito', value: '1,842', trend: '98.2%', isPos: true, icon: ShieldCheck, color: C.primary },
  { id: 3, title: 'En Revisión (Manual)', value: '15', trend: 'Prioridad Alta', isPos: false, icon: FileText, color: '#3B82F6' },
];

const VALIDATIONS_DATA = [
  { id: 'VAL-101', target: 'Carlos Ruiz', type: 'Identidad (KYC)', date: 'Hace 10 min', status: 'Pendiente', priority: 'Alta', avatar: 'C' },
  { id: 'VAL-102', target: 'Villa de Cristal', type: 'Documentos Propiedad', date: 'Hace 45 min', status: 'En Revisión', priority: 'Media', avatar: 'V' },
  { id: 'VAL-103', target: 'Ana García', type: 'Identidad (KYC)', date: 'Hoy, 09:30 AM', status: 'Aprobado', priority: 'Baja', avatar: 'A' },
  { id: 'VAL-104', target: 'Loft Urbano', type: 'Documentos Propiedad', date: 'Ayer, 04:15 PM', status: 'Rechazado', priority: 'Alta', avatar: 'L' },
  { id: 'VAL-105', target: 'Pedro Montes', type: 'Identidad (KYC)', date: 'Ayer, 02:00 PM', status: 'Aprobado', priority: 'Media', avatar: 'P' },
];

export default function ValidationsScreen() {
  const [activeTab, setActiveTab] = useState('Owners');
  const [filterStatus, setFilterStatus] = useState('Todas');

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Aprobado': return { text: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 };
      case 'Pendiente': return { text: '#F59E0B', bg: '#FFFBEB', icon: Clock };
      case 'En Revisión': return { text: '#3B82F6', bg: '#EFF6FF', icon: Eye };
      case 'Rechazado': return { text: '#EF4444', bg: '#FEF2F2', icon: XCircle };
      default: return { text: '#64748B', bg: '#F8FAFC', icon: ShieldAlert };
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
      
      {/* ─── Header Section ─── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, gap: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Validaciones</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>Centro de verificación de seguridad y confianza Trabbitt.</Text>
        </View>

        {/* Tab Bar Operativo (Estilo Anuncios) */}
        <View style={{ flexDirection: 'row', gap: 32, alignItems: 'center', marginRight: 'auto', paddingHorizontal: 32 }}>
          {[
            { label: 'Owners', id: 'Owners' },
            { label: 'Anuncios', id: 'Anuncios' }
          ].map((type) => {
            const isSel = activeTab === type.id;
            return (
              <TouchableOpacity 
                key={type.id} 
                onPress={() => setActiveTab(type.id)}
                style={{ paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: isSel ? C.primary : 'transparent' }}
              >
                <Text style={{ color: isSel ? C.textDark : '#94A3B8', fontSize: 15, fontWeight: isSel ? '800' : '600' }}>{type.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ width: 40 }} />
      </View>



      {/* ─── Tabla de Validaciones (Bento Style) ─── */}
      <View style={{
        backgroundColor: C.card, borderRadius: 24, padding: 32,
        shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
        borderWidth: 1, borderColor: C.borderLight
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          {/* Filtros de Estado Operativo */}
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            {[
              { label: 'Todas', id: 'Todas' },
              { label: 'Pendientes', id: 'Pendiente' },
              { label: 'Completadas', id: 'Aprobado' },
              { label: 'Rechazadas', id: 'Rechazado' }
            ].map((f) => {
              const isSel = filterStatus === f.label || (f.label === 'Todas' && filterStatus === 'Todas');
              return (
                <TouchableOpacity 
                  key={f.label} 
                  onPress={() => setFilterStatus(f.label)}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
                    backgroundColor: isSel ? C.textDark : '#F1F5F9',
                    borderWidth: 1, borderColor: isSel ? C.textDark : '#E2E8F0'
                  }}
                >
                  <Text style={{ color: isSel ? '#FFFFFF' : C.textMuted, fontSize: 12, fontWeight: '800' }}>{f.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{
              flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
              borderWidth: 1, borderColor: '#E2E8F0', width: 300
            }}>
              <Search size={14} color={C.textMuted} />
              <TextInput placeholder="Buscar usuario o ID..." style={{ marginLeft: 10, fontSize: 13, flex: 1, outlineStyle: 'none' }} />
          </View>
        </View>

        {/* Cabecera Tabla */}
        <View style={{ flexDirection: 'row', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 }}>
          <Text style={{ flex: 1.5, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>USUARIO / PROPIEDAD</Text>
          <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>TIPO VERIFICACIÓN</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PRIORIDAD</Text>
          <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>SOLICITUD</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ESTADO</Text>
          <Text style={{ width: 140, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1, textAlign: 'center' }}>ACCIONES</Text>
        </View>

        {/* Filas */}
        {VALIDATIONS_DATA
          .filter(item => {
            if (filterStatus === 'Todas') return true;
            if (filterStatus === 'Pendientes') return item.status === 'Pendiente';
            if (filterStatus === 'Completadas') return item.status === 'Aprobado';
            if (filterStatus === 'Rechazadas') return item.status === 'Rechazado';
            return true;
          })
          .map((item, idx) => {
          const style = getStatusStyle(item.status);
          const Icon = style.icon;
          return (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: idx === VALIDATIONS_DATA.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' }}>
              
              {/* Target */}
              <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Text style={{ fontWeight: '800', fontSize: 13 }}>{item.avatar}</Text>
                </View>
                <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.target}</Text>
              </View>

              {/* Tipo */}
              <View style={{ flex: 1.2, flexDirection: 'row', alignItems: 'center' }}>
                {item.type.includes('Identidad') ? <UserCheck size={14} color={C.textMuted} /> : <Building2 size={14} color={C.textMuted} />}
                <Text style={{ color: C.textMuted, fontSize: 13, fontWeight: '600', marginLeft: 8 }}>{item.type}</Text>
              </View>

              {/* Prioridad */}
              <View style={{ flex: 1 }}>
                 <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: item.priority === 'Alta' ? '#FEF2F2' : '#F8FAFC' }}>
                    <Text style={{ color: item.priority === 'Alta' ? '#EF4444' : C.textMuted, fontSize: 11, fontWeight: '800' }}>{item.priority}</Text>
                 </View>
              </View>

              {/* Fecha */}
              <Text style={{ flex: 1.2, color: C.textDark, fontSize: 13, fontWeight: '600' }}>{item.date}</Text>

              {/* Estado */}
              <View style={{ flex: 1 }}>
                 <View style={{ alignSelf: 'flex-start', backgroundColor: style.bg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon size={12} color={style.text} strokeWidth={3} />
                    <Text style={{ color: style.text, fontSize: 10, fontWeight: '800', marginLeft: 6 }}>{item.status.toUpperCase()}</Text>
                 </View>
              </View>

              {/* Acciones */}
              <View style={{ width: 140, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={{ padding: 8, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                   <Eye size={16} color={C.textMuted} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Paginación */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
            <Text style={{ color: C.textMuted, fontSize: 14, fontWeight: '600' }}>Mostrando <Text style={{ color: C.textDark, fontWeight: '800' }}>1 a 5</Text> de 32 pendientes</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={{ padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8 }}>
                <ChevronLeft size={18} color={C.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8 }}>
                <ChevronRight size={18} color={C.textDark} />
              </TouchableOpacity>
            </View>
        </View>

      </View>

    </ScrollView>
  );
}
