import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ChevronLeft, MapPin, Star, Building2, 
  CheckCircle2, Clock, Ban, User, 
  ShieldCheck, ArrowLeft, Image as ImageIcon,
  Wifi, Utensils, Dumbbell, Coffee, Car,
  Check, X, ShieldAlert, Users, BedDouble, Bath, DoorOpen, Home, Clock3, Ban as BanIcon,
  MessageCircle, Star as StarIcon, FileEdit, Languages, Target, Package, Footprints, ChevronRight
} from 'lucide-react-native';
import { db } from '../../../src/lib/firebase';
import { doc, getDoc, updateDoc, onSnapshot, collection, query, where, orderBy, getDocs, limit, startAfter } from 'firebase/firestore';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  textDark: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
};

function ReviewItem({ review }: { review: any }) {
  const [userName, setUserName] = useState(review.userName || 'Usuario de Trabbitt');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (review.clientId) {
        try {
          const userSnap = await getDoc(doc(db, 'users', review.clientId));
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const fullName = `${userData.name || ''} ${userData.lastName || ''}`.trim();
            if (fullName) setUserName(fullName);
          }
        } catch (error) {
          console.error("Error fetching user for review:", error);
        }
      }
      setLoading(false);
    }
    fetchUserData();
  }, [review.clientId]);

  return (
    <View style={{ 
      padding: 24, backgroundColor: '#FFFFFF', borderRadius: 24, 
      borderWidth: 1, borderColor: C.border,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color={C.textDark} />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '800', color: C.textDark }}>{userName}</Text>
            <Text style={{ fontSize: 12, color: C.textMuted }}>{review.createdAt?.toDate()?.toLocaleDateString() || 'Reciente'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
          <StarIcon size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#B45309' }}>{review.rating}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22 }}>{review.comment}</Text>
    </View>
  );
}

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState<any[]>([null]); // Cursor for the START of each page
  const [hasMore, setHasMore] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [realRating, setRealRating] = useState(0);
  const [realReviewCount, setRealReviewCount] = useState(0);
  const scrollRef = useRef<any>(null);

  // Sync real-time count and rating from the entire reviews collection for this property
  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'reviews'), where('advertisementId', '==', id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allReviews = snapshot.docs.map(doc => doc.data());
      const count = allReviews.length;
      const totalRating = allReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
      const avg = count > 0 ? totalRating / count : 0;
      setRealRating(avg);
      setRealReviewCount(count);
    });
    return () => unsubscribe();
  }, [id]);

  const fetchReviews = async (pageNumber: number) => {
    if (!id || pageNumber < 1) return;
    setIsReviewsLoading(true);
    try {
      const reviewsRef = collection(db, 'reviews');
      const startCursor = pageCursors[pageNumber - 1];
      
      let q = query(
        reviewsRef, 
        where('advertisementId', '==', id), 
        orderBy('createdAt', 'desc'), 
        limit(4)
      );

      if (startCursor) {
        q = query(q, startAfter(startCursor));
      }
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setReviews(data);
      setHasMore(data.length === 4);
      setCurrentPage(pageNumber);

      // If we are on a new page, store the last document as the cursor for the NEXT page
      if (data.length === 4) {
        const nextCursor = snapshot.docs[snapshot.docs.length - 1];
        setPageCursors(prev => {
          const newCursors = [...prev];
          newCursors[pageNumber] = nextCursor;
          return newCursors;
        });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  useEffect(() => {
    setPageCursors([null]);
    fetchReviews(1);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, 'advertisements', id as string);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAd({ id: docSnap.id, ...data });
        setInternalNote(data.internalNote || '');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    setIsUpdating(true);
    try {
      const docRef = doc(db, 'advertisements', id as string);
      await updateDoc(docRef, {
        verificationStatus: newStatus
      });
      // Opcional: Podríamos enviar una notificación al dueño aquí
    } catch (error) {
      console.error("Error updating status:", error);
      alert("No se pudo actualizar el estatus");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNote = async () => {
    if (!id) return;
    setIsSavingNote(true);
    try {
      await updateDoc(doc(db, 'advertisements', id as string), { internalNote });
      // Visual feedback handled by state, or could add a toast
    } catch (error) {
      console.error("Error saving note:", error);
      alert("No se pudo guardar la nota");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleToggleFeature = async (val: boolean) => {
    if (!id) return;
    try {
      await updateDoc(doc(db, 'advertisements', id as string), { isFeatured: val });
    } catch (error) {
      console.error("Error toggling feature:", error);
      alert("No se pudo actualizar la visibilidad");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  if (!ad) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <Text style={{ color: C.textDark, fontSize: 18, fontWeight: '700' }}>Anuncio no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: C.primary, fontWeight: '800' }}>Volver al panel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const vStatus = ad.verificationStatus || 'En verificación';

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* ─── Top Bar ─── */}
      <View style={{ 
        flexDirection: 'row', alignItems: 'center', padding: 24, 
        backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: C.border 
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{
          width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9',
          alignItems: 'center', justifyContent: 'center', marginRight: 16
        }}>
          <ArrowLeft size={20} color={C.textDark} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>Detalles del Anuncio</Text>
          <Text style={{ fontSize: 22, fontWeight: '900', color: C.textDark }}>{ad.title}</Text>
        </View>
        
        {/* Status Badge */}
        <View style={{ 
          paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,
          backgroundColor: vStatus === 'Verificado' ? '#ECFDF5' : vStatus === 'Rechazado' ? '#FEF2F2' : '#FFFBEB',
          flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1,
          borderColor: vStatus === 'Verificado' ? '#D1FAE5' : vStatus === 'Rechazado' ? '#FEE2E2' : '#FEF3C7'
        }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: vStatus === 'Verificado' ? C.primary : vStatus === 'Rechazado' ? C.danger : C.warning }} />
          <Text style={{ color: vStatus === 'Verificado' ? C.primary : vStatus === 'Rechazado' ? C.danger : C.warning, fontWeight: '800', fontSize: 12, textTransform: 'uppercase' }}>
            {vStatus}
          </Text>
        </View>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 40, paddingHorizontal: '5%' }}>
        
        {/* ─── Header Section (Title & Price) ─── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 }}>
              <Text style={{ fontSize: 32, fontWeight: '900', color: C.textDark }}>{ad.title}</Text>
              
              <TouchableOpacity 
                onPress={() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                }}
                activeOpacity={0.7}
                style={{ 
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                  paddingVertical: 4
                }}
              >
                <View style={{ flexDirection: 'row', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={14} 
                      color={s <= Math.round(realRating) ? "#FFD700" : "#D1D5DB"} 
                      fill={s <= Math.round(realRating) ? "#FFD700" : "transparent"} 
                      strokeWidth={s <= Math.round(realRating) ? 0 : 1.5}
                    />
                  ))}
                </View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.textDark, marginLeft: 4 }}>
                  {realRating > 0 ? realRating.toFixed(1) : '0.0'}
                </Text>
                <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '500' }}>
                  ({realReviewCount})
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MapPin size={18} color={C.textMuted} />
              <Text style={{ fontSize: 16, fontWeight: '600', color: C.textMuted }}>{ad.location}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', marginLeft: 24 }}>
            <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 }}>Precio / Noche</Text>
            <Text style={{ fontSize: 32, fontWeight: '900', color: C.primary }}>Q {ad.price}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 48 }}>
          
          {/* ─── Left Column: Core Content ─── */}
          <View style={{ flex: 2.2 }}>
            
            {/* Bento Gallery (Compact Height) */}
            <View style={{ height: 360, flexDirection: 'row', gap: 16, marginBottom: 40 }}>
              <View style={{ flex: 2, borderRadius: 24, overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
                {ad.photos && ad.photos.length > 0 ? (
                  <Image source={{ uri: ad.photos[0] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={48} color={C.textMuted} /></View>
                )}
              </View>
              <View style={{ flex: 1, gap: 16 }}>
                <View style={{ flex: 1, borderRadius: 24, overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
                  {ad.photos && ad.photos.length > 1 ? (
                    <Image source={{ uri: ad.photos[1] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={24} color={C.textMuted} /></View>
                  )}
                </View>
                <View style={{ flex: 1, borderRadius: 24, overflow: 'hidden', backgroundColor: '#E2E8F0' }}>
                  {ad.photos && ad.photos.length > 2 ? (
                    <Image source={{ uri: ad.photos[2] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={24} color={C.textMuted} /></View>
                  )}
                </View>
              </View>
            </View>

            {/* Clean Quick Stats (No borders) */}
            <View style={{ flexDirection: 'row', gap: 48, paddingBottom: 32, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 32 }}>
              {ad.type === 'experience' ? (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Users size={24} color={C.textDark} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textDark }}>Hasta {ad.maxParticipants || 1} Pax</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Clock3 size={24} color={C.textDark} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textDark }}>{ad.duration || 120} min</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Languages size={24} color={C.textDark} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textDark }}>{ad.languages || 'Español'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Footprints size={24} color={C.textDark} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textDark, textTransform: 'capitalize' }}>{ad.difficultyLevel === 'beginner' ? 'Básico' : ad.difficultyLevel === 'intermediate' ? 'Medio' : ad.difficultyLevel === 'advanced' ? 'Avanzado' : (ad.difficultyLevel || 'Básico')}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Users size={24} color={C.textDark} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textDark }}>{ad.guests || 1} Huéspedes</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <DoorOpen size={24} color={C.textDark} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textDark }}>{ad.bedrooms || 1} Cuartos</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <BedDouble size={24} color={C.textDark} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textDark }}>{ad.beds || 1} Camas</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Bath size={24} color={C.textDark} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: C.textDark }}>{ad.bathrooms || 1} Baños</Text>
                  </View>
                </>
              )}
            </View>

            {/* Description directly on background */}
            <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark, marginBottom: 16 }}>Sobre este lugar</Text>
            <Text style={{ fontSize: 16, color: '#475569', lineHeight: 28, paddingBottom: 32, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 32 }}>
              {ad.description || "Sin descripción proporcionada."}
            </Text>

            {/* Timings & Rules Clean Grid */}
            {ad.type === 'experience' ? (
              <View style={{ flexDirection: 'row', gap: 40, paddingBottom: 32, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 32 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark, marginBottom: 20 }}>Punto de Encuentro</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <Target size={20} color={C.primary} style={{ marginTop: 4 }} />
                    <Text style={{ fontSize: 16, color: '#475569', flex: 1, lineHeight: 24 }}>{ad.meetingPoint || 'No especificado'}</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark, marginBottom: 20 }}>Requisitos y Extras</Text>
                  <View style={{ gap: 16 }}>
                    <View>
                      <Text style={{ fontSize: 12, color: C.primary, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 }}>TÚ PROPORCIONAS</Text>
                      <Text style={{ fontSize: 15, color: C.textDark, fontWeight: '500' }}>{ad.includes || 'Ninguno'}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 12, color: C.warning, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 }}>DEBEN LLEVAR</Text>
                      <Text style={{ fontSize: 15, color: C.textDark, fontWeight: '500' }}>{ad.whatToBring || 'Ninguno'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 40, paddingBottom: 32, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 32 }}>
                {/* Timings */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark, marginBottom: 20 }}>Horarios</Text>
                  <View style={{ gap: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Clock3 size={20} color={C.textMuted} />
                      <View>
                        <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: '700' }}>CHECK-IN</Text>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: C.textDark }}>{ad.checkIn || '15:00'}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Clock3 size={20} color={C.textMuted} />
                      <View>
                        <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: '700' }}>CHECK-OUT</Text>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: C.textDark }}>{ad.checkOut || '11:00'}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Rules */}
                <View style={{ flex: 1.5 }}>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark, marginBottom: 20 }}>Reglas de la Casa</Text>
                  <View style={{ flexDirection: 'row', gap: 24 }}>
                    <View style={{ alignItems: 'center' }}>
                      {ad.rules?.pets ? <CheckCircle2 size={24} color={C.primary} /> : <BanIcon size={24} color={C.danger} />}
                      <Text style={{ marginTop: 8, fontSize: 14, fontWeight: '700', color: C.textDark }}>Mascotas</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      {ad.rules?.smoking ? <CheckCircle2 size={24} color={C.primary} /> : <BanIcon size={24} color={C.danger} />}
                      <Text style={{ marginTop: 8, fontSize: 14, fontWeight: '700', color: C.textDark }}>Fumar</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      {ad.rules?.parties ? <CheckCircle2 size={24} color={C.primary} /> : <BanIcon size={24} color={C.danger} />}
                      <Text style={{ marginTop: 8, fontSize: 14, fontWeight: '700', color: C.textDark }}>Fiestas</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Amenidades (Solo Propiedades) */}
            {ad.type !== 'experience' && (
              <>
                <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark, marginBottom: 20 }}>Amenidades incluidas</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {ad.amenities?.map((amenity: string, idx: number) => (
                    <View key={idx} style={{ 
                      flexDirection: 'row', alignItems: 'center', gap: 8, 
                      paddingHorizontal: 16, paddingVertical: 10, borderRadius: 99, 
                      backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' 
                    }}>
                      <CheckCircle2 size={16} color={C.textDark} />
                      <Text style={{ fontSize: 14, fontWeight: '700', color: C.textDark, textTransform: 'capitalize' }}>{amenity}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* ─── Reviews Section ─── */}
            <View style={{ marginTop: 48 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>Reseñas de Usuarios</Text>
                <View style={{ backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.textMuted }}>{reviews.length} opiniones</Text>
                </View>
              </View>

              {reviews.length === 0 && !isReviewsLoading ? (
                <View style={{ padding: 40, backgroundColor: '#F8FAFC', borderRadius: 24, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: C.border }}>
                  <StarIcon size={32} color={C.textMuted} />
                  <Text style={{ marginTop: 12, fontSize: 16, color: C.textMuted, fontWeight: '600' }}>Este anuncio aún no tiene reseñas.</Text>
                </View>
              ) : (
                <View style={{ gap: 24 }}>
                  {isReviewsLoading ? (
                    <ActivityIndicator size="large" color={C.primary} style={{ marginVertical: 20 }} />
                  ) : (
                    <>
                      {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                      ))}
                      
                      {/* Pagination Controls */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 12 }}>
                        <TouchableOpacity 
                          disabled={currentPage === 1 || isReviewsLoading}
                          onPress={() => fetchReviews(currentPage - 1)}
                          style={{ 
                            flexDirection: 'row', alignItems: 'center', gap: 8, 
                            paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
                            backgroundColor: currentPage === 1 ? '#F1F5F9' : C.textDark,
                            opacity: currentPage === 1 ? 0.5 : 1
                          }}
                        >
                          <ChevronLeft size={18} color={currentPage === 1 ? C.textMuted : '#FFFFFF'} />
                          <Text style={{ color: currentPage === 1 ? C.textMuted : '#FFFFFF', fontWeight: '800' }}>Anterior</Text>
                        </TouchableOpacity>

                        <Text style={{ fontSize: 15, fontWeight: '800', color: C.textDark }}>
                          Página {currentPage}
                        </Text>

                        <TouchableOpacity 
                          disabled={!hasMore || isReviewsLoading}
                          onPress={() => fetchReviews(currentPage + 1)}
                          style={{ 
                            flexDirection: 'row', alignItems: 'center', gap: 8, 
                            paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12,
                            backgroundColor: !hasMore ? '#F1F5F9' : C.textDark,
                            opacity: !hasMore ? 0.5 : 1
                          }}
                        >
                          <Text style={{ color: !hasMore ? C.textMuted : '#FFFFFF', fontWeight: '800' }}>Siguiente</Text>
                          <ChevronRight size={18} color={!hasMore ? C.textMuted : '#FFFFFF'} />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* ─── Right Column: Sticky Panel ─── */}
          <View style={{ flex: 1 }}>
            
            {/* Wrapper for stickiness (on web) */}
            <View style={{ position: 'sticky' as any, top: 40 }}>
              
              {/* Verification Panel */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 32, padding: 32, borderWidth: 2, borderColor: vStatus === 'Verificado' ? C.primary : vStatus === 'Rechazado' ? C.danger : C.primary, shadowColor: C.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <ShieldCheck size={28} color={C.primary} />
                  <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>Auditoría</Text>
                </View>
                
                <Text style={{ fontSize: 14, color: C.textMuted, lineHeight: 22, marginBottom: 32 }}>
                  Asegúrate de que la propiedad cumple con los estándares de calidad de Trabbitt.
                </Text>

                <View style={{ gap: 16 }}>
                  <TouchableOpacity 
                    disabled={isUpdating || vStatus === 'Verificado'}
                    onPress={() => handleUpdateStatus('Verificado')}
                    style={{ 
                      width: '100%', height: 60, borderRadius: 16, backgroundColor: C.primary, 
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
                      opacity: vStatus === 'Verificado' ? 0.5 : 1
                    }}
                  >
                    {isUpdating ? <ActivityIndicator color="#FFFFFF" /> : (
                      <>
                        <Check size={24} color="#FFFFFF" strokeWidth={3} />
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>Aprobar Anuncio</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    disabled={isUpdating || vStatus === 'Rechazado'}
                    onPress={() => handleUpdateStatus('Rechazado')}
                    style={{ 
                      width: '100%', height: 60, borderRadius: 16, backgroundColor: '#FFFFFF', 
                      borderWidth: 2, borderColor: C.danger,
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
                      opacity: vStatus === 'Rechazado' ? 0.5 : 1
                    }}
                  >
                    <X size={24} color={C.danger} strokeWidth={3} />
                    <Text style={{ color: C.danger, fontSize: 16, fontWeight: '900' }}>Rechazar</Text>
                  </TouchableOpacity>
                </View>

                {vStatus === 'Verificado' && (
                  <View style={{ marginTop: 24, padding: 16, backgroundColor: '#ECFDF5', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <CheckCircle2 size={18} color={C.primary} />
                    <Text style={{ color: C.primary, fontSize: 13, fontWeight: '700' }}>Anuncio oficial y activo.</Text>
                  </View>
                )}
              </View>

              {/* Compact Host Card */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border, marginBottom: 24 }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', marginBottom: 16 }}>Propietario</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={24} color={C.textDark} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: C.textDark }}>{ad.ownerName || "Propietario"}</Text>
                    <Text style={{ fontSize: 12, color: C.textMuted }}>ID: {ad.ownerId?.substring(0, 8)}...</Text>
                  </View>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: C.border }}>
                  <MessageCircle size={16} color={C.textDark} />
                  <Text style={{ fontSize: 13, fontWeight: '800', color: C.textDark }}>Contactar Anfitrión</Text>
                </TouchableOpacity>
              </View>

              {/* Admin Tools: Featured & Notes */}
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border }}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', marginBottom: 20 }}>Herramientas Admin</Text>
                
                {/* Featured Toggle */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' }}>
                      <StarIcon size={18} color={C.warning} />
                    </View>
                    <View>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: C.textDark }}>Destacar Anuncio</Text>
                      <Text style={{ fontSize: 11, color: C.textMuted }}>Mostrar en pantalla principal</Text>
                    </View>
                  </View>
                  <Switch 
                    value={ad.isFeatured || false} 
                    onValueChange={handleToggleFeature}
                    trackColor={{ false: '#E2E8F0', true: C.primary }}
                  />
                </View>

                {/* Internal Notes */}
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <FileEdit size={16} color={C.textDark} />
                    <Text style={{ fontSize: 14, fontWeight: '800', color: C.textDark }}>Notas Internas (Solo Admin)</Text>
                  </View>
                  <TextInput
                    value={internalNote}
                    onChangeText={setInternalNote}
                    placeholder="Ej: Foto 2 muy oscura, pedir cambios..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    style={{ 
                      backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, 
                      minHeight: 100, fontSize: 14, color: C.textDark, 
                      borderWidth: 1, borderColor: C.border, marginBottom: 12,
                      textAlignVertical: 'top'
                    }}
                  />
                  <TouchableOpacity 
                    onPress={handleSaveNote}
                    disabled={isSavingNote || internalNote === ad.internalNote}
                    style={{ 
                      paddingVertical: 12, borderRadius: 12, alignItems: 'center',
                      backgroundColor: (internalNote !== ad.internalNote) ? C.textDark : '#F1F5F9'
                    }}
                  >
                    {isSavingNote ? <ActivityIndicator color="#FFFFFF" size="small" /> : (
                      <Text style={{ color: (internalNote !== ad.internalNote) ? '#FFFFFF' : C.textMuted, fontWeight: '800', fontSize: 13 }}>
                        Guardar Nota
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

              </View>

            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
