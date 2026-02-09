import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InventoryItem } from '../types';
import { CATEGORIES } from '../constants';
import { DatePicker } from './forms/DatePicker';

interface ItemEditModalProps {
	visible: boolean;
	item: InventoryItem | null;
	onClose: () => void;
	onSave: (item: InventoryItem) => void;
}

const formatDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const normalizeDate = (date: Date): Date => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const calculateDaysUntilExpiry = (expiryDate: Date): number => {
	const today = normalizeDate(new Date());
	const expiry = normalizeDate(expiryDate);
	const diffMs = expiry.getTime() - today.getTime();
	return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const getStatusFromDays = (days: number): InventoryItem['status'] => {
	if (days <= 3) return 'urgent';
	if (days <= 7) return 'soon';
	return 'safe';
};

const ItemEditModal: React.FC<ItemEditModalProps> = ({
	visible,
	item,
	onClose,
	onSave,
}) => {
	const [name, setName] = useState('');
	const [quantity, setQuantity] = useState('1');
	const [unit, setUnit] = useState('unité');
	const [category, setCategory] = useState(CATEGORIES[1]);
	const [expiryDate, setExpiryDate] = useState<Date>(new Date());

	useEffect(() => {
		if (!item) return;
		setName(item.name);
		setQuantity(String(item.quantity));
		setUnit(item.unit || 'unité');
		setCategory(item.category);
		const parsedDate = new Date(item.expiryDate);
		setExpiryDate(isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
	}, [item]);

	if (!item) return null;

	const handleSave = () => {
		if (!name.trim()) {
			Alert.alert('Erreur', 'Le nom est requis');
			return;
		}

		const parsedQuantity = parseFloat(quantity);
		if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
			Alert.alert('Erreur', 'Quantité invalide');
			return;
		}

		const daysUntilExpiry = calculateDaysUntilExpiry(expiryDate);
		const updatedItem: InventoryItem = {
			...item,
			name: name.trim(),
			quantity: parsedQuantity,
			unit: unit.trim() || 'unité',
			category,
			expiryDate: formatDate(expiryDate),
			daysUntilExpiry,
			status: getStatusFromDays(daysUntilExpiry),
		};

		onSave(updatedItem);
	};

	return (
		<Modal
			animationType="slide"
			transparent
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Modifier l'article</Text>
						<TouchableOpacity onPress={onClose}>
							<Ionicons name="close" size={24} color="#374151" />
						</TouchableOpacity>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Nom du produit</Text>
						<TextInput
							style={styles.input}
							value={name}
							onChangeText={setName}
							placeholder="Ex: Pommes"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Quantité</Text>
						<TextInput
							style={styles.input}
							value={quantity}
							onChangeText={setQuantity}
							keyboardType="numeric"
							placeholder="1"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Unité</Text>
						<TextInput
							style={styles.input}
							value={unit}
							onChangeText={setUnit}
							placeholder="unité"
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Catégorie</Text>
						<View style={styles.categorySelect}>
							{CATEGORIES.slice(1).map((cat) => (
								<TouchableOpacity
									key={cat}
									style={[styles.catOption, category === cat && styles.catOptionActive]}
									onPress={() => setCategory(cat)}
								>
									<Text style={[styles.catOptionText, category === cat && styles.catOptionTextActive]}>
										{cat}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>

					<View style={styles.inputGroup}>
						<DatePicker
							value={expiryDate}
							onChange={setExpiryDate}
							label="Date d'expiration"
						/>
					</View>

					<View style={styles.actions}>
						<TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
							<Text style={styles.cancelBtnText}>Annuler</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
							<Text style={styles.submitBtnText}>Enregistrer</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		minHeight: 420,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#111827',
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 8,
	},
	input: {
		backgroundColor: '#f9fafb',
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 12,
		padding: 12,
		fontSize: 16,
	},
	categorySelect: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	catOption: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	catOptionActive: {
		backgroundColor: '#111827',
		borderColor: '#111827',
	},
	catOptionText: {
		fontSize: 12,
		color: '#374151',
	},
	catOptionTextActive: {
		color: '#fff',
	},
	actions: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 8,
	},
	cancelBtn: {
		flex: 1,
		backgroundColor: '#f3f4f6',
		padding: 14,
		borderRadius: 12,
		alignItems: 'center',
	},
	cancelBtnText: {
		color: '#374151',
		fontWeight: '700',
	},
	submitBtn: {
		flex: 1,
		backgroundColor: '#00C8B4',
		padding: 14,
		borderRadius: 12,
		alignItems: 'center',
	},
	submitBtnText: {
		color: '#fff',
		fontWeight: '700',
	},
});

export default ItemEditModal;
