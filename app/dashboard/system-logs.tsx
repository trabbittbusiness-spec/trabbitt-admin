import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { 
  ArrowLeft, Clock, Shield, AlertTriangle, 
  User, Database, RefreshCw, Trash2, Filter, Smartphone
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { db } from '../../src/lib/firebase';
import { 
  collection, query, orderBy, limit, onSnapshot, 
  Timestamp, doc, deleteDoc 
} from 'firebase/firestore';

const C = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

interface LogEntry {
  id: string;
  action: string;
  category: 'SECURITY' | 'INFRASTRUCTURE' | 'COMMISSIONS' | 'USER_ACTION';
  details: string;
  userId?: string;
  userName?: string;
  timestamp: any;
  severity: 'INFO' | 'WARNING' | 'ERROR';
}

export default function SystemLogsScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'system_logs'), 
      orderBy('timestamp', 'desc'), 
      limit(50)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data() 
      })) as LogEntry[];
      setLogs(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const formatDate = (ts: any) => {
    if (!ts) return '—';
    const date = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
    return date.toLocaleString('es-GT', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'ERROR': return { bg: '#FEF2F2', text: '#EF4444', icon: AlertTriangle };
      case 'WARNING': return { bg: '#FFFBEB', text: '#F59E0B', icon: AlertTriangle };
      default: return { bg: '#EFF6FF', text: '#3B82F6', icon: Shield };
    }
  };

  const renderLogItem = ({ item }: { item: LogEntry }) => {
    const style = getSeverityStyle(item.severity);
    const Icon = style.icon;

    return (
      <View style={{
        backgroundColor: C.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: C.border,
        flexDirection: 'row',
        gap: 16
      }}>
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: style.bg,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} color={style.text} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: C.textDark }}>{item.action}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Clock size={12} color={C.textMuted} />
              <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: '600' }}>{formatDate(item.timestamp)}</Text>
            </View>
          </View>
          
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 4, lineHeight: 18 }}>
            {item.details}
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 12, gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <User size={12} color={C.textMuted} />
              <Text style={{ fontSize: 11, color: C.textDark, fontWeight: '700' }}>{item.userName || 'Sistema'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
              <Database size={12} color={C.textMuted} />
              <Text style={{ fontSize: 11, color: C.textDark, fontWeight: '700' }}>{item.category}</Text>
            </View>
            
            {item.device && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EFF6FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Smartphone size={12} color="#3B82F6" />
                <Text style={{ fontSize: 11, color: '#1E40AF', fontWeight: '700' }}>{item.device}</Text>
              </View>
            )}

            {item.ip && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Shield size={12} color="#10B981" />
                <Text style={{ fontSize: 11, color: '#166534', fontWeight: '700' }}>{item.ip}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={{ 
        backgroundColor: C.surface, 
        paddingTop: 60, 
        paddingBottom: 24, 
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderColor: C.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={20} color={C.textDark} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '900', color: C.textDark }}>Logs de Sistema</Text>
            <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '500' }}>Monitoreo de infraestructura en tiempo real</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}
        >
          <RefreshCw size={18} color={C.textDark} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={C.primary} style={{ marginTop: 100 }} />
          ) : (
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <Shield size={48} color={C.border} />
              <Text style={{ color: C.textMuted, marginTop: 16, fontSize: 15, fontWeight: '600' }}>No hay registros disponibles</Text>
            </View>
          )
        }
      />
    </View>
  );
}
