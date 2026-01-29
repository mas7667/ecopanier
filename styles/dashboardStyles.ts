import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  content: {
    paddingBottom: 80,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  darkSectionTitle: {
    color: '#fff',
  },
  seeAllLink: {
    fontSize: 14,
    color: '#00C8B4',
    fontWeight: '600',
  },
  horizontalScroll: {
    flexDirection: 'row',
    paddingLeft: 16,
  },
});
