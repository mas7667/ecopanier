import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { InventoryItem } from '../types';

interface ScanEcranProps {
  onAdd: (item: InventoryItem) => void;
  onFinish?: () => void;
}

type ScanMode = 'scanning' | 'manual' | 'success';

const ScanEcran: React.FC<ScanEcranProps> = ({ onAdd, onFinish }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanLockRef = useRef(false);
  const lastScanRef = useRef<{ data: string; time: number } | null>(null);
  const [mode, setMode] = useState<ScanMode>('scanning');
  const [successMessage, setSuccessMessage] = useState('Produit ajouté avec succès.');
  const [manualBarcode, setManualBarcode] = useState<string>('');

  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState('Autres');
  const [manualQuantity, setManualQuantity] = useState('1');
  const [manualUnit, setManualUnit] = useState('unité');
  const [manualExpiryDate, setManualExpiryDate] = useState('');
  const [manualImage, setManualImage] = useState('');

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>EcoManger a besoin de la caméra pour scanner vos produits.</Text>
        <Button onPress={requestPermission} title="Autoriser la caméra" />
      </View>
    );
  }

  const resetScan = () => {
    scanLockRef.current = false;
    setScanned(false);
    setMode('scanning');
  };

  const handleManualAdd = () => {
    if (!manualName.trim()) {
      Alert.alert('Erreur', 'Le nom du produit est requis.');
      return;
    }

    const fallbackExpiry = new Date();
    fallbackExpiry.setDate(fallbackExpiry.getDate() + 30);
    const expiryDate = manualExpiryDate || fallbackExpiry.toISOString().slice(0, 10);

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: manualName.trim(),
      category: manualCategory.trim() || 'Autres',
      quantity: parseFloat(manualQuantity) || 1,
      unit: manualUnit.trim() || 'unité',
      expiryDate,
      daysUntilExpiry: 30,
      status: 'safe',
      image: manualImage.trim() || 'https://picsum.photos/200',
      barcode: manualBarcode || undefined,
    };

    onAdd(newItem);
    setSuccessMessage('Produit ajouté manuellement.');
    setMode('success');
  };

  const handleBarCodeScanned = async ({ type, data }: BarcodeScanningResult) => {
    if (scanLockRef.current) {
      return;
    }

    const now = Date.now();
    if (lastScanRef.current && lastScanRef.current.data === data && now - lastScanRef.current.time < 2000) {
      return;
    }

    scanLockRef.current = true;
    lastScanRef.current = { data, time: now };
    setScanned(true);

    console.log(`Code scanné : ${data} (${type})`);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const json = await response.json();

      if (json.status === 1) {
        const nomProduit = json.product?.product_name || 'Produit';
        const image = json.product?.image_front_small_url || 'https://picsum.photos/200';
        const quantityText = json.product?.quantity || '';
        const categories = json.product?.categories_tags || [];
        const category = Array.isArray(categories) && categories.length > 0
          ? String(categories[0]).replace('fr:', '').replace('en:', '').replace(/-/g, ' ')
          : 'Autres';

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        const isoDate = expiryDate.toISOString().slice(0, 10);

        const newItem: InventoryItem = {
          id: Date.now().toString(),
          name: nomProduit,
          category,
          quantity: 1,
          unit: quantityText || 'unité',
          expiryDate: isoDate,
          daysUntilExpiry: 30,
          status: 'safe',
          image,
          barcode: data,
        };

        onAdd(newItem);
        setSuccessMessage(`Produit ajouté : ${nomProduit}`);
        setMode('success');
      } else {
        setManualBarcode(data);
        setManualName('');
        setManualCategory('Autres');
        setManualQuantity('1');
        setManualUnit('unité');
        setManualExpiryDate('');
        setManualImage('');
        setMode('manual');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Problème de connexion.');
      resetScan();
    }
  };

  if (mode === 'manual') {
    return (
      <ScrollView contentContainerStyle={styles.manualContainer}>
        <Text style={styles.manualTitle}>Ajout manuel</Text>
        <Text style={styles.manualSubtitle}>Produit non trouvé. Ajoutez-le manuellement.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom du produit</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Yaourt nature"
            value={manualName}
            onChangeText={setManualName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catégorie</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Produits laitiers"
            value={manualCategory}
            onChangeText={setManualCategory}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex]}>
            <Text style={styles.label}>Quantité</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={manualQuantity}
              onChangeText={setManualQuantity}
            />
          </View>
          <View style={[styles.inputGroup, styles.flex]}>
            <Text style={styles.label}>Unité</Text>
            <TextInput
              style={styles.input}
              placeholder="unité"
              value={manualUnit}
              onChangeText={setManualUnit}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date d’expiration (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="2026-01-30"
            value={manualExpiryDate}
            onChangeText={setManualExpiryDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image (URL)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            value={manualImage}
            onChangeText={setManualImage}
          />
        </View>

        <View style={styles.manualButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleManualAdd}>
            <Text style={styles.primaryButtonText}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={resetScan}>
            <Text style={styles.secondaryButtonText}>Scanner</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (mode === 'success') {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successTitle}>Succès</Text>
        <Text style={styles.successMessage}>{successMessage}</Text>
        <View style={styles.successButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={resetScan}>
            <Text style={styles.primaryButtonText}>Scanner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onFinish}>
            <Text style={styles.secondaryButtonText}>Terminer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'upc_a', 'upc_e'],
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.textInstruction}>Placez le code-barres dans le cadre</Text>
      </View>

      {scanned && (
        <View style={styles.bottomButton}>
          <Button title={'Scanner à nouveau'} onPress={resetScan} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    paddingHorizontal: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  textInstruction: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  manualContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  manualTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  manualSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  manualButtons: {
    marginTop: 12,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#00C8B4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#111827',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  successMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  successButtons: {
    width: '100%',
    gap: 12,
  },
});

export default ScanEcran;
