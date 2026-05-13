import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { 
  Search, Send, Paperclip, MoreVertical, 
  CheckCheck, Clock, User, Phone, 
  ShieldAlert, CheckCircle2, ChevronLeft, Search as SearchIcon
} from 'lucide-react-native';
import { db } from '../../src/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';

const C = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#F1F5F9',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  inputBg: '#F8FAFC',
};

export default function SupportScreen() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [filter, setFilter] = useState('Todos');

  const activeChat = tickets.find(t => t.id === activeChatId) || null;

  useEffect(() => {
    const q = query(collection(db, 'support_tickets'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snap) => {
       const tPromises = snap.docs.map(async d => {
         const data = d.data();
         let timeStr = 'Ahora';
         if (data.updatedAt) {
           const dObj = data.updatedAt.toDate();
           timeStr = dObj.getHours() + ':' + String(dObj.getMinutes()).padStart(2, '0');
         }

         // Resolve User Role from users collection
         let userRole = 'Usuario';
         if (data.ownerId) {
            try {
               const uSnap = await getDoc(doc(db, 'users', data.ownerId));
               if (uSnap.exists()) {
                  const u = uSnap.data();
                  if (u.role === 'owner') userRole = 'Anfitrión';
                  else if (u.role === 'client') userRole = 'Cliente';
                  else if (u.role === 'admin') userRole = 'Administrador';
                  else userRole = u.role || 'Cliente';
               }
            } catch (e) {
               console.warn('Error fetching role:', e);
            }
         }

         return { 
           id: d.id, 
           timeStr, 
           userRole,
           ...data 
         };
       });
       const resolvedTickets = await Promise.all(tPromises);
       setTickets(resolvedTickets);
       if (resolvedTickets.length > 0) {
          setActiveChatId(prev => prev ? prev : resolvedTickets[0].id);
       }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeChat?.id) {
       const q = query(collection(db, 'support_tickets', activeChat.id, 'messages'), orderBy('createdAt', 'asc'));
       const unsubscribe = onSnapshot(q, (snap) => {
          const msgs = snap.docs.map(d => {
            let timeStr = '';
            if (d.data().createdAt) {
               const dObj = d.data().createdAt.toDate();
               timeStr = dObj.getHours() + ':' + String(dObj.getMinutes()).padStart(2, '0');
            }
            return { id: d.id, timeStr, ...d.data() };
          });
          setMessages(msgs);
       });
       
       if (activeChat.unreadAdmin) {
          updateDoc(doc(db, 'support_tickets', activeChat.id), { unreadAdmin: false });
       }
       
       return () => unsubscribe();
    }
  }, [activeChat?.id]);

  const handleSendMessage = async () => {
     if (!newMessage.trim() || !activeChat?.id) return;
     const text = newMessage.trim();
     setNewMessage('');
     
     const ticketRef = doc(db, 'support_tickets', activeChat.id);
     await updateDoc(ticketRef, {
        updatedAt: serverTimestamp(),
        lastMessage: text,
        unreadAdmin: false
     });
     
     await addDoc(collection(db, 'support_tickets', activeChat.id, 'messages'), {
        text,
        sender: 'support',
        createdAt: serverTimestamp()
     });
  };

  const handleCloseTicket = async () => {
    if (!activeChat?.id) return;
    await updateDoc(doc(db, 'support_tickets', activeChat.id), {
       status: 'Resuelto'
    });
  };

  const handleTogglePriority = async () => {
    if (!activeChat?.id) return;
    const priorities = ['Alta', 'Media', 'Baja'];
    const currentIdx = priorities.indexOf(activeChat.priority || 'Media');
    const nextPriority = priorities[(currentIdx + 1) % priorities.length];
    
    await updateDoc(doc(db, 'support_tickets', activeChat.id), {
       priority: nextPriority
    });
  };

  const filteredTickets = tickets.filter(t => filter === 'Todos' || t.status === filter || (filter === 'Abiertos' && t.status === 'Abierto'));
  const openCount = tickets.filter(t => t.status === 'Abierto').length;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, flexDirection: 'row' }}>
      
      {/* ─── Sidebar (Inbox) ─── */}
      <View style={{ width: 380, borderRightWidth: 1, borderRightColor: C.border, height: '100%', backgroundColor: C.surface }}>
        <View style={{ padding: 24, paddingBottom: 12 }}>
           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: C.textDark }}>Soporte</Text>
              <View style={{ backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                 <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '800' }}>{openCount} abiertos</Text>
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
           {filteredTickets.map((chat) => (
             <TouchableOpacity 
                key={chat.id} 
                onPress={() => setActiveChatId(chat.id)}
                style={{
                  paddingHorizontal: 24, paddingVertical: 16,
                  backgroundColor: activeChat?.id === chat.id ? '#F8FAFC' : 'transparent',
                  borderLeftWidth: 3, borderLeftColor: activeChat?.id === chat.id ? C.primary : 'transparent',
                  flexDirection: 'row', alignItems: 'center'
                }}
             >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 14, overflow: 'hidden' }}>
                   {chat.avatar?.startsWith('http') ? (
                      <Image source={{ uri: chat.avatar }} style={{ width: '100%', height: '100%' }} />
                   ) : (
                      <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 15 }}>{chat.avatar || 'P'}</Text>
                   )}
                </View>
                <View style={{ flex: 1 }}>
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                        <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 14 }} numberOfLines={1}>{chat.name || 'Usuario'}</Text>
                        <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, borderWidth: 1, borderColor: '#E2E8F0' }}>
                          <Text style={{ color: C.textMuted, fontSize: 9, fontWeight: '800', textTransform: 'uppercase' }}>{chat.userRole}</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                         <View style={{ 
                           backgroundColor: chat.priority === 'Alta' ? '#FEF2F2' : (chat.priority === 'Baja' ? '#F0FDF4' : '#F8FAFC'), 
                           paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
                           borderWidth: 1, borderColor: chat.priority === 'Alta' ? '#FECACA' : (chat.priority === 'Baja' ? '#BBF7D0' : '#E2E8F0')
                         }}>
                           <Text style={{ 
                             color: chat.priority === 'Alta' ? '#EF4444' : (chat.priority === 'Baja' ? '#22C55E' : C.textMuted), 
                             fontSize: 9, fontWeight: '800' 
                           }}>{(chat.priority || 'Media').toUpperCase()}</Text>
                         </View>
                         <Text style={{ color: C.textMuted, fontSize: 11, fontWeight: '500' }}>{chat.timeStr}</Text>
                      </View>
                   </View>
                   <Text numberOfLines={1} style={{ color: chat.unreadAdmin ? C.textDark : C.textMuted, fontSize: 12, fontWeight: chat.unreadAdmin ? '700' : '500' }}>
                      {chat.lastMessage}
                   </Text>
                </View>
                {chat.unreadAdmin && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary, marginLeft: 10 }} />}
             </TouchableOpacity>
           ))}
           {filteredTickets.length === 0 && (
              <View style={{ padding: 24, alignItems: 'center' }}>
                 <Text style={{ color: C.textMuted }}>No hay tickets en esta categoría.</Text>
              </View>
           )}
        </ScrollView>
      </View>

      {/* ─── Chat Area ─── */}
      <View style={{ flex: 1, height: '100%', backgroundColor: '#F8FAFC' }}>
        
        {/* Chat Header */}
        {activeChat ? (
          <>
          <View style={{ 
            height: 80, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
            flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, justifyContent: 'space-between'
          }}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 14, overflow: 'hidden' }}>
                   {activeChat.avatar?.startsWith('http') ? (
                      <Image source={{ uri: activeChat.avatar }} style={{ width: '100%', height: '100%' }} />
                   ) : (
                      <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 15 }}>{activeChat.avatar || 'P'}</Text>
                   )}
                </View>
                <View>
                   <Text style={{ color: C.textDark, fontSize: 16, fontWeight: '900' }}>{activeChat.name}</Text>
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: activeChat.status === 'Resuelto' ? C.textMuted : '#10B981', marginRight: 6 }} />
                      <Text style={{ color: activeChat.status === 'Resuelto' ? C.textMuted : '#10B981', fontSize: 11, fontWeight: '700' }}>
                         {activeChat.userRole} • {activeChat.status === 'Resuelto' ? 'Ticket Cerrado' : 'App Móvil • Online'}
                      </Text>
                   </View>
                </View>
             </View>

             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity 
                  onPress={handleTogglePriority}
                  style={{ 
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, 
                    backgroundColor: activeChat.priority === 'Alta' ? '#FEF2F2' : (activeChat.priority === 'Baja' ? '#F0FDF4' : '#F8FAFC'),
                    flexDirection: 'row', alignItems: 'center',
                    borderWidth: 1, borderColor: activeChat.priority === 'Alta' ? '#FECACA' : (activeChat.priority === 'Baja' ? '#BBF7D0' : '#E2E8F0')
                  }}>
                   <ShieldAlert size={12} color={activeChat.priority === 'Alta' ? '#EF4444' : (activeChat.priority === 'Baja' ? '#22C55E' : C.textMuted)} />
                   <Text style={{ 
                      marginLeft: 6, fontSize: 11, fontWeight: '800', 
                      color: activeChat.priority === 'Alta' ? '#EF4444' : (activeChat.priority === 'Baja' ? '#22C55E' : C.textMuted) 
                   }}>PRIORIDAD {(activeChat.priority || 'Media').toUpperCase()}</Text>
                </TouchableOpacity>
                {activeChat.status !== 'Resuelto' && (
                  <TouchableOpacity onPress={handleCloseTicket} style={{
                    backgroundColor: C.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10
                  }}>
                     <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Finalizar Ticket</Text>
                  </TouchableOpacity>
                )}
             </View>
          </View>

        {/* Messages List */}
        <ScrollView style={{ flex: 1, padding: 32 }} contentContainerStyle={{ gap: 24, paddingBottom: 40 }}>
           {messages.map((m, idx) => {
             const isSupport = m.sender === 'support';
             return (
               <View key={m.id || idx} style={{ 
                  flexDirection: 'row', 
                  justifyContent: isSupport ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end'
               }}>
                  {!isSupport && (
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 4, overflow: 'hidden' }}>
                       {activeChat.avatar?.startsWith('http') ? (
                          <Image source={{ uri: activeChat.avatar }} style={{ width: '100%', height: '100%' }} />
                       ) : (
                          <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 10 }}>{activeChat.avatar || 'P'}</Text>
                       )}
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
                     }}>{m.timeStr}</Text>
                  </View>
               </View>
             );
           })}
           {messages.length === 0 && (
             <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: C.textMuted }}>No hay mensajes. ¡Escribe el primero!</Text>
             </View>
           )}
        </ScrollView>

        {/* Input Bar */}
        <View style={{ padding: 32, paddingTop: 16 }}>
           <View style={{ 
              flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8,
              shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 5,
              borderWidth: 1, borderColor: C.border,
              opacity: activeChat.status === 'Resuelto' ? 0.5 : 1
           }}>
              <TouchableOpacity style={{ padding: 12 }}>
                 <Paperclip size={20} color={C.textMuted} />
              </TouchableOpacity>
              <TextInput 
                placeholder={activeChat.status === 'Resuelto' ? "Este ticket está cerrado." : "Escribe un mensaje aquí..."}
                multiline
                editable={activeChat.status !== 'Resuelto'}
                value={newMessage}
                onChangeText={setNewMessage}
                style={{ flex: 1, paddingHorizontal: 12, fontSize: 14, color: C.textDark, outlineStyle: 'none', maxHeight: 100 }}
              />
              <TouchableOpacity 
                onPress={handleSendMessage}
                disabled={activeChat.status === 'Resuelto'}
                style={{ 
                  width: 48, height: 48, borderRadius: 24, backgroundColor: activeChat.status === 'Resuelto' ? C.textMuted : C.primary, 
                  alignItems: 'center', justifyContent: 'center',
                  shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
                }}>
                 <Send size={18} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
           </View>
           <Text style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: C.textMuted, fontWeight: '500' }}>
              Los mensajes se envían en tiempo real.
           </Text>
        </View>
        </>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <SearchIcon size={48} color={C.border} />
            <Text style={{ marginTop: 16, color: C.textMuted, fontWeight: '700' }}>Selecciona un ticket para comenzar</Text>
          </View>
        )}
      </View>

    </View>
  );
}
