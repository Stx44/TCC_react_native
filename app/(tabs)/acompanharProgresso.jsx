import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';

const { width } = Dimensions.get('window');

// URL da API definida diretamente para evitar erros de importação se o config.js estiver sem export
const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 80, 103, 1)`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    fillShadowGradient: '#005067',
    fillShadowGradientOpacity: 1,
    fillShadowGradientFrom: '#005067',
    fillShadowGradientTo: '#005067',
    style: { borderRadius: 16 },
    propsForDots: { r: '6', strokeWidth: '1', stroke: '#888888ff' },
    barPercentage: 0.6,
};

export default function AcompanharProgresso() {
    const { usuarioId } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // Dados para os gráficos
    const [evolucaoData, setEvolucaoData] = useState({ labels: [], datasets: [{ data: [] }] });
    const [metasData, setMetasData] = useState({ labels: [], datasets: [{ data: [] }] });
    
    // Dados para o Botão de Ranking
    const [userPoints, setUserPoints] = useState(0);

    // Função para definir a patente (usada no botão)
    const getCurrentTierName = (p) => {
        if (p >= 1000) return 'Diamante';
        if (p >= 600) return 'Platina';
        if (p >= 300) return 'Ouro';
        if (p >= 100) return 'Prata';
        return 'Bronze';
    };

    useFocusEffect(
        useCallback(() => {
            if (usuarioId) {
                buscarDadosDoDashboard();
            }
        }, [usuarioId])
    );

    const buscarDadosDoDashboard = async () => {
        try {
            // Buscando ranking (para pegar pontos), evolução e metas
            // Adicionei um catch individual para evitar que um erro de rede quebre tudo
            const [pontosResponse, evolucaoResponse, metasResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/get-points/${usuarioId}`).catch(e => ({ data: { points: 0 } })), 
                axios.get(`${API_BASE_URL}/dashboard/evolucao-peso/${usuarioId}`).catch(e => ({ data: { evolucao_peso: [] } })),
                axios.get(`${API_BASE_URL}/metas/${usuarioId}`).catch(e => ({ data: { metas: [] } }))
            ]);

            // 1. Pontos do Usuário (Para o Botão)
            if (pontosResponse && pontosResponse.data) {
                setUserPoints(pontosResponse.data.points || 0);
            }

            // 2. Evolução de Peso
            const dadosPesoBruto = evolucaoResponse.data?.evolucao_peso || [];
            if (Array.isArray(dadosPesoBruto) && dadosPesoBruto.length > 0) {
                const labels = dadosPesoBruto.map(item => moment(item.data_registro).format('DD/MM'));
                const valores = dadosPesoBruto.map(item => parseFloat(item.peso));
                setEvolucaoData({ labels: labels, datasets: [{ data: valores }] });
            } else {
                setEvolucaoData({ labels: [], datasets: [{ data: [] }] });
            }

            // 3. Metas
            const metasBruto = metasResponse.data?.metas || [];
            if (metasBruto.length > 0) {
                const metasOrdenadas = [...metasBruto].sort((a, b) => new Date(a.data_agendada) - new Date(b.data_agendada));
                const metasPorSemana = metasOrdenadas.reduce((acc, meta) => {
                    const semanaInicio = moment(meta.data_agendada).startOf('week').format('DD/MM');
                    if (!acc[semanaInicio]) {
                        acc[semanaInicio] = { total: 0, concluidas: 0 };
                    }
                    acc[semanaInicio].total += 1;
                    if (meta.concluido) {
                        acc[semanaInicio].concluidas += 1;
                    }
                    return acc;
                }, {});

                setMetasData({
                    labels: Object.keys(metasPorSemana),
                    datasets: [{
                        data: Object.values(metasPorSemana).map(semana => semana.concluidas)
                    }]
                });
            } else {
                setMetasData({ labels: [], datasets: [{ data: [] }] });
            }

        } catch (error) {
            console.error("Erro geral no dashboard:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        buscarDadosDoDashboard();
    };

    const currentTier = getCurrentTierName(userPoints);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#005067" />
                <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
        );
    }

    return (
        <ImageBackground
            source={require("../../assets/images/paredebranca.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContentContainer} 
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >

                    <Text style={styles.titulo}>Acompanhar progresso</Text>

                    {/* --- NOVO BOTÃO DE RANKING (Substituindo a tabela) --- */}
                    <TouchableOpacity 
                        style={styles.rankingButton} 
                        onPress={() => router.push('/ranking')}
                        activeOpacity={0.9}
                    >
                        {/* Fundo decorativo sutil */}
                        <View style={styles.buttonBgOverlay} />
                        
                        <View style={styles.rankingHeader}>
                            <Text style={styles.rankingTitle}>RANKING</Text>
                            <Ionicons name="chevron-forward-circle" size={28} color="#fff" />
                        </View>

                        <View style={styles.rankingContent}>
                            <View>
                                <Text style={styles.pointsLabel}>Pontuação Total</Text>
                                <Text style={styles.pointsValue}>{userPoints}</Text>
                            </View>
                            
                            <View style={styles.tierTag}>
                                <Ionicons name="shield-checkmark" size={14} color="#004d40" style={{marginRight: 4}}/>
                                <Text style={styles.tierTagText}>{currentTier}</Text>
                            </View>
                        </View>

                        <Text style={styles.clickHint}>Toque para ver a Jornada dos Rankings</Text>
                    </TouchableOpacity>
                    {/* ----------------------------------------------------- */}

                    {/* CARD PESO */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Evolução Peso (kg)</Text>
                        {evolucaoData && evolucaoData.labels && evolucaoData.labels.length > 0 ? (
                            <BarChart
                                data={evolucaoData}
                                width={width * 0.82}
                                height={220}
                                yAxisLabel=""
                                yAxisSuffix="kg"
                                chartConfig={chartConfig}
                                verticalLabelRotation={30}
                                fromZero
                                showValuesOnTopOfBars
                                flatColor={true}
                            />
                        ) : (
                            <Text style={styles.noDataText}>
                                Nenhum registro de peso.{'\n'}
                                Registre seu peso na tela de Exercícios.
                            </Text>
                        )}
                    </View>

                    {/* CARD METAS */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Metas Concluídas por Semana</Text>
                        {metasData && metasData.labels && metasData.labels.length > 0 ? (
                            <BarChart
                                data={metasData}
                                width={width * 0.82}
                                height={220}
                                yAxisLabel=""
                                chartConfig={chartConfig}
                                verticalLabelRotation={30}
                                fromZero
                                flatColor={true}
                            />
                        ) : <Text style={styles.noDataText}>Nenhum dado de metas.</Text>}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    topo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: width * 0.04,
        paddingVertical: width * 0.02,
        marginBottom: width * 0.04,
    },
    voltar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtVoltar: {
        color: '#005067',
        fontSize: width * 0.04,
        marginLeft: width * 0.01,
    },
    logoSuperior: {
        width: width * 0.25,
        height: width * 0.1,
        resizeMode: 'contain',
    },
    scrollContentContainer: {
        paddingHorizontal: '7%',
        flexGrow: 1,
        paddingBottom: 100,
    },
    titulo: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#005067',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 115
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#005067',
        marginBottom: 15,
        textAlign: 'center',
    },
    noDataText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#888',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 18,
        color: '#005067',
        marginTop: 10,
    },
    // --- ESTILOS DO NOVO BOTÃO RANKING ---
    rankingButton: {
        backgroundColor: '#005067',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#009688',
        position: 'relative',
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonBgOverlay: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 50,
    },
    rankingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    rankingTitle: {
        color: '#009688',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    rankingContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 15,
    },
    pointsLabel: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 2,
    },
    pointsValue: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        // Se a fonte SpaceMono não carregar, usa padrão
        fontFamily: 'monospace', 
    },
    tierTag: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tierTagText: {
        color: '#004d40',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
    },
    clickHint: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 5,
    },
});