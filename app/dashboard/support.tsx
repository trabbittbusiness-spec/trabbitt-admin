import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { 
  Search, Send, Paperclip, MoreVertical, 
  CheckCheck, Clock, User, Phone, 
  ShieldAlert, CheckCircle2, ChevronLeft, Search as SearchIcon
} from 'lucide-react-native';

const C = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#F1F5F9',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  inputBg: '#F8FAFC',
};

const CHATS = [
  { id: 1, name: 'Patricia Morales', msg: 'No puedo completar el pago de mi reserva...', time: '10 min', unread: true, status: 'Abierto', priority: 'Alta', avatar: 'P' },
  { id: 2, name: 'Roberto León', msg: '¿Cómo subo más de 5 fotos a mi propiedad?', time: '34 min', unread: false, status: 'Abierto', priority: 'Media', avatar: 'R' },
  { id: 3, name: 'Carlos Ruiz', msg: 'El retiro no aparece en mi billetera todavía.', time: '1h', unread: false, status: 'Pendiente', priority: 'Alta', avatar: 'C' },
  { id: 4, name: 'Ana García', msg: '¡Gracias por la ayuda! Ya pude entrar.', time: '2h', unread: false, status: 'Resuelto', priority: 'Baja', avatar: 'A' },
  { id: 5, name: 'Luis Tambriz', msg: 'La app se cierra al abrir el mapa.', time: '4h', unread: false, status: 'Resuelto', priority: 'Media', avatar: 'L' },
];

const MESSAGES = [
  { id: 1, text: 'Hola soporte, tengo un problema con mi pago.', sender: 'client', time: '10:05 AM' },
  { id: 2, text: 'Intenté con dos tarjetas diferentes y ambas me dan error de servidor.', sender: 'client', time: '10:05 AM' },
  { id: 3, text: 'Hola Patricia, lamento el inconveniente. ¿Podrías indicarme los últimos 4 dígitos de la tarjeta?', sender: 'support', time: '10:12 AM' },
  { id: 4, text: 'Sí claro, son 4592 y 1102.', sender: 'client', time: '10:14 AM' },
  { id: 5, text: 'Perfecto, estoy revisando con el banco. Un momento por favor.', sender: 'support', time: '10:15 AM' },
];

export default function SupportScreen() {
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [filter, setFilter] = useState('Todos');

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, flexDirection: 'row' }}>
      
      {/* ─── Sidebar (Inbox) ─── */}
      <View style={{ width: 380, borderRightWidth: 1, borderRightColor: C.border, height: '100%', backgroundColor: C.surface }}>
        <View style={{ padding: 24, paddingBottom: 12 }}>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: C.textDark }}>Soporte</Text>
              <View style={{ backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                 <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '800' }}>3 abiertos</Text>
              </View>
           </View>

           {/* Filtros Micro */}
           <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
              {['Todos', 'Abiertos', 'Pendientes', 'Resueltos'].map((label) => {
                const isSel = filter === label;
                return (
                  <TouchableOpacity 
                    key={label}
                    onPress={() => setFilter(label)}
                    style={{
                      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99,
                      backgroundColor: isSel ? C.textDark : '#F1F5F9',
                      borderWidth: 1, borderColor: isSel ? C.textDark : '#E2E8F0'
                    }}
                  >
                    <Text style={{ color: isSel ? '#FFFFFF' : C.textMuted, fontSize: 11, fontWeight: '800' }}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
           </View>

           <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
              <SearchIcon size={14} color={C.textMuted} />
              <TextInput placeholder="Buscar conversación..." style={{ marginLeft: 10, fontSize: 13, flex: 1, outlineStyle: 'none' }} />
           </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 8 }}>
           {CHATS.map((chat) => (
             <TouchableOpacity 
                key={chat.id} 
                onPress={() => setActiveChat(chat)}
                style={{
                  paddingHorizontal: 24, paddingVertical: 16,
                  backgroundColor: activeChat.id === chat.id ? '#F8FAFC' : 'transparent',
                  borderLeftWidth: 3, borderLeftColor: activeChat.id === chat.id ? C.primary : 'transparent',
                  flexDirection: 'row', alignItems: 'center'
                }}
             >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                   <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 15 }}>{chat.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 14 }}>{chat.name}</Text>
                      <Text style={{ color: C.textMuted, fontSize: 11, fontWeight: '500' }}>{chat.time}</Text>
                   </View>
                   <Text numberOfLines={1} style={{ color: chat.unread ? C.textDark : C.textMuted, fontSize: 12, fontWeight: chat.unread ? '700' : '500' }}>
                      {chat.msg}
                   </Text>
                </View>
                {chat.unread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary, marginLeft: 10 }} />}
             </TouchableOpacity>
           ))}
        </ScrollView>
      </View>

      {/* ─── Chat Area ─── */}
      <View style={{ flex: 1, height: '100%', backgroundColor: '#F8FAFC' }}>
        
        {/* Chat Header */}
        <View style={{ 
          height: 80, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
          flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, justifyContent: 'space-between'
        }}>
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                 <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 15 }}>{activeChat.avatar}</Text>
              </View>
              <View>
                 <Text style={{ color: C.textDark, fontSize: 16, fontWeight: '900' }}>{activeChat.name}</Text>
                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 }} />
                    <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700' }}>Escritorio • Online</Text>
                 </View>
              </View>
           </View>

           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ 
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, 
                backgroundColor: activeChat.priority === 'Alta' ? '#FEF2F2' : '#F1F5F9',
                flexDirection: 'row', alignItems: 'center'
              }}>
                 <ShieldAlert size={12} color={activeChat.priority === 'Alta' ? '#EF4444' : C.textMuted} />
                 <Text style={{ 
                    marginLeft: 6, fontSize: 11, fontWeight: '800', 
                    color: activeChat.priority === 'Alta' ? '#EF4444' : C.textMuted 
                 }}>PRIORIDAD {activeChat.priority.toUpperCase()}</Text>
              </View>
              <TouchableOpacity style={{
                backgroundColor: C.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10
              }}>
                 <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Finalizar Ticket</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* Messages List */}
        <ScrollView style={{ flex: 1, padding: 32 }} contentContainerStyle={{ gap: 24, paddingBottom: 40 }}>
           {MESSAGES.map((m, idx) => {
             const isSupport = m.sender === 'support';
             return (
               <View key={idx} style={{ 
                  flexDirection: 'row', 
                  justifyContent: isSupport ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end'
               }}>
                  {!isSupport && (
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 4 }}>
                       <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 10 }}>P</Text>
                    </View>
                  )}
                  <View style={{ maxWidth: '70%' }}>
                     <View style={{ 
                        padding: 16, borderRadius: 20,
                        backgroundColor: isSupport ? C.primary : '#FFFFFF',
                        borderBottomLeftRadius: isSupport ? 20 : 4,
                        borderBottomRightRadius: isSupport ? 4 : 20,
                        shadowColor: '#334155', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2
                     }}>
                        <Text style={{ color: isSupport ? '#FFFFFF' : C.textDark, fontSize: 14, fontWeight: '500', lineHeight: 20 }}>
                           {m.text}
                        </Text>
                     </View>
                     <Text style={{ 
                        marginTop: 6, fontSize: 10, color: C.textMuted, fontWeight: '600', 
                        textAlign: isSupport ? 'right' : 'left', paddingHorizontal: 4
                     }}>{m.time}</Text>
                  </View>
               </View>
             );
           })}
        </ScrollView>

        {/* Input Bar */}
        <View style={{ padding: 32, paddingTop: 16 }}>
           <View style={{ 
              flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8,
              shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 5,
              borderWidth: 1, borderColor: C.border
           }}>
              <TouchableOpacity style={{ padding: 12 }}>
                 <Paperclip size={20} color={C.textMuted} />
              </TouchableOpacity>
              <TextInput 
                placeholder="Escribe un mensaje aquí..." 
                multiline
                style={{ flex: 1, paddingHorizontal: 12, fontSize: 14, color: C.textDark, outlineStyle: 'none', maxHeight: 100 }}
              />
              <TouchableOpacity style={{ 
                width: 48, height: 48, borderRadius: 24, backgroundColor: C.primary, 
                alignItems: 'center', justifyContent: 'center',
                shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
              }}>
                 <Send size={18} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
           </View>
           <Text style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: C.textMuted, fontWeight: '500' }}>
              Shift + Enter para nueva línea • Patricia Morales está escribiendo...
           </Text>
        </View>

      </View>

    </View>
  );
}
