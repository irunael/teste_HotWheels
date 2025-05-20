import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, Modal, TextInput, FlatList, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from './styles';

const API_BASE = 'https://hotwheels-1-dkgkfbcsa7gjedh9.brazilsouth-01.azurewebsites.net';

export default function Home() {
    const navigation = useNavigation();

    const [modalAberto, setModalAberto] = useState(false);
    const [modalEditarAberto, setModalEditarAberto] = useState(false);

    const [nome, setNome] = useState('');
    const [anoFabricacao, setAnoFabricacao] = useState('');
    const [serie, setSerie] = useState('');
    const [numeroColecao, setNumeroColecao] = useState('');
    const [status, setStatus] = useState('');
    const [favorito, setFavorito] = useState(false);
    const [imagem, setImagem] = useState('');

    const [catalogo, setCatalogo] = useState([]);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

    const carregarCatalogo = () => {
        fetch(`${API_BASE}/hotwheels`)
            .then(response => response.json())
            .then(data => setCatalogo(data))
            .catch(error => console.error('Erro ao carregar o catálogo:', error));
    };

    const salvarCatalogo = () => {
        fetch(`${API_BASE}/hotwheels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome, anoFabricacao, serie, numeroColecao, status, favorito, imagem,
            }),
        })
            .then(response => response.json())
            .then(() => {
                setModalAberto(false);
                resetForm();
                carregarCatalogo();
            })
            .catch(error => console.error('Erro ao salvar:', error));
    };

    const editarCatalogo = () => {
        fetch(`${API_BASE}/hotwheels/${itemSelecionado.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome, anoFabricacao, serie, numeroColecao, status, favorito, imagem,
            }),
        })
            .then(response => response.json())
            .then(() => {
                setModalEditarAberto(false);
                resetForm();
                carregarCatalogo();
            })
            .catch(error => console.error('Erro ao atualizar:', error));
    };

    const deletarItem = (id) => {
        fetch(`${API_BASE}/hotwheels/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) setCatalogo(catalogo.filter(item => item.id !== id));
                else console.error('Erro ao deletar item:', response.status);
            })
            .catch(error => console.error('Erro ao deletar item:', error));
    };

    const abrirModalEditar = (item) => {
        setItemSelecionado(item);
        setNome(item.nome);
        setAnoFabricacao(item.anoFabricacao);
        setSerie(item.serie);
        setNumeroColecao(item.numeroColecao);
        setStatus(item.status);
        setFavorito(item.favorito);
        setImagem(item.imagem);
        setModalEditarAberto(true);
    };

    const resetForm = () => {
        setNome('');
        setAnoFabricacao('');
        setSerie('');
        setNumeroColecao('');
        setStatus('');
        setFavorito(false);
        setImagem('');
        setItemSelecionado(null);
    };

    useEffect(() => {
        carregarCatalogo();
    }, []);

    const renderCard = ({ item }) => (
        <View style={{
            backgroundColor: '#FFD700',
            borderRadius: 12,
            marginVertical: 8,
            marginHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,  // Aumentei o padding para acomodar a imagem maior
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }}>
            <Image
                source={item.imagem ? { uri: item.imagem } : require('../../assets/carro1.png')}
                style={{
                    width: 100,  // Aumentei de 70 para 100
                    height: 70,  // Aumentei de 50 para 70
                    resizeMode: 'contain',
                    marginRight: 15,  // Aumentei o marginRight para 15
                }}
            />
            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#003366' }}>{item.nome?.toUpperCase()}</Text>
                <Text style={{ fontSize: 14, color: '#003366', marginVertical: 3 }}>{item.anoFabricacao}</Text>
                <TouchableOpacity onPress={() => abrirModalEditar(item)}>
                    <Text style={{ fontSize: 14, color: '#003366', textDecorationLine: 'underline' }}>
                        Ver mais...
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={{
                    marginLeft: 8,
                    backgroundColor: '#FF3333',
                    borderRadius: 20,
                    padding: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => deletarItem(item.id)}
            >
                <FontAwesome name="trash" size={18} color="#FFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={require('../../assets/logoHW.png')} style={styles.logo} />
                <Text style={styles.title}>MINHA COLEÇÃO</Text>
            </View>

            {/* Lista de Cards */}
            <FlatList
                data={mostrarFavoritos ? catalogo.filter(item => item.favorito) : catalogo}
                keyExtractor={item => item.id?.toString() || Math.random().toString()}
                contentContainerStyle={styles.listContainer}
                renderItem={renderCard}
                showsVerticalScrollIndicator={false}
            />

            {/* Menu Inferior */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 14,
                backgroundColor: '#003366',
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 8,
            }}>
                {/* Botão Home */}
                <TouchableOpacity
                    style={{
                        marginHorizontal: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: mostrarFavoritos ? 'transparent' : '#FFD700',
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                    }}
                    onPress={() => {
                        setMostrarFavoritos(false);
                        navigation.navigate('Home');
                    }}
                >
                    <FontAwesome 
                        name="home" 
                        size={24} 
                        color={mostrarFavoritos ? "#ccc" : "#003366"} 
                    />
                </TouchableOpacity>

                {/* Botão Adicionar */}
                <TouchableOpacity
                    style={{
                        marginHorizontal: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#FFD700',
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        shadowColor: '#FFD700',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 4,
                    }}
                    onPress={() => setModalAberto(true)}
                >
                    <FontAwesome name="plus" size={28} color="#003366" />
                </TouchableOpacity>

                {/* Botão Favoritos */}
                <TouchableOpacity
                    style={{
                        marginHorizontal: 32,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: mostrarFavoritos ? '#FFD700' : 'transparent',
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                    }}
                    onPress={() => setMostrarFavoritos(!mostrarFavoritos)}
                >
                    <FontAwesome
                        name="heart"
                        size={24}
                        color={mostrarFavoritos ? "#003366" : "#ccc"}
                    />
                </TouchableOpacity>
            </View>

            {/* Modal Cadastro */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalAberto}
                onRequestClose={() => setModalAberto(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.content}>
                        <Text style={styles.tituloModal}>Novo Hot Wheels</Text>
                        <View style={styles.inputsContainer}>
                            <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
                            <TextInput placeholder="Ano de Fabricação" style={styles.input} value={anoFabricacao} onChangeText={setAnoFabricacao} keyboardType="numeric" />
                            <TextInput placeholder="Série" style={styles.input} value={serie} onChangeText={setSerie} />
                            <TextInput placeholder="Número da Coleção" style={styles.input} value={numeroColecao} onChangeText={setNumeroColecao} />
                            <TextInput placeholder="Status" style={styles.input} value={status} onChangeText={setStatus} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 4 }}>
                                <Text style={{ marginRight: 10 }}>Favorito:</Text>
                                <Switch value={favorito} onValueChange={setFavorito} />
                            </View>
                            <TextInput placeholder="Imagem (URL)" style={styles.input} value={imagem} onChangeText={setImagem} />
                        </View>
                        <View style={{ width: '90%', alignSelf: 'center' }}>
                            <TouchableOpacity 
                                style={[styles.btnSalvar, { marginBottom: 10 }]} 
                                onPress={salvarCatalogo}
                            >
                                <Text style={styles.salvar}>Adicionar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.btnCancelar} 
                                onPress={() => setModalAberto(false)}
                            >
                                <Text style={styles.cancelar}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Editar */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalEditarAberto}
                onRequestClose={() => setModalEditarAberto(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.content}>
                        <Text style={styles.tituloModal}>Editar {itemSelecionado?.nome}</Text>
                        
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <Image
                                source={itemSelecionado?.imagem ? { uri: itemSelecionado.imagem } : require('../../assets/carro1.png')}
                                style={{ width: 200, height: 150, resizeMode: 'contain' }}
                            />
                        </View>
                        
                        <View style={styles.inputsContainer}>
                            <TextInput 
                                placeholder="Nome" 
                                style={styles.input} 
                                value={nome} 
                                onChangeText={setNome} 
                            />
                            <TextInput 
                                placeholder="Ano de Fabricação" 
                                style={styles.input} 
                                value={anoFabricacao} 
                                onChangeText={setAnoFabricacao} 
                                keyboardType="numeric" 
                            />
                            <TextInput 
                                placeholder="Série" 
                                style={styles.input} 
                                value={serie} 
                                onChangeText={setSerie} 
                            />
                            <TextInput 
                                placeholder="Número da Coleção" 
                                style={styles.input} 
                                value={numeroColecao} 
                                onChangeText={setNumeroColecao} 
                            />
                            <TextInput 
                                placeholder="Status" 
                                style={styles.input} 
                                value={status} 
                                onChangeText={setStatus} 
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 4 }}>
                                <Text style={{ marginRight: 10 }}>Favorito:</Text>
                                <Switch value={favorito} onValueChange={setFavorito} />
                            </View>
                            <TextInput 
                                placeholder="Imagem (URL)" 
                                style={styles.input} 
                                value={imagem} 
                                onChangeText={setImagem} 
                            />
                        </View>
                        
                        <View style={{ width: '90%', alignSelf: 'center' }}>
                            <TouchableOpacity 
                                style={[styles.btnSalvar, { marginBottom: 10 }]} 
                                onPress={editarCatalogo}
                            >
                                <Text style={styles.salvar}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.btnCancelar} 
                                onPress={() => setModalEditarAberto(false)}
                            >
                                <Text style={styles.cancelar}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}