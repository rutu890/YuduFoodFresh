import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { colors } from "../constants/colors";

const cuisines = ["All", "Biryani", "Pizza", "South Indian", "Chinese"];
const prices = ["Any", "Under ₹200", "₹200–₹400", "Above ₹400"];
const sorts = [
  "Relevance",
  "Rating",
  "Delivery time",
  "Price: Low to High",
  "Popular",
];

export default function FilterModal({
  visible,
  onClose,
  onApply,
  initialFilters,
}) {
  const [sort, setSort] = useState(initialFilters?.sort || "Relevance");
  const [cuisine, setCuisine] = useState(initialFilters?.cuisine || "All");
  const [price, setPrice] = useState(initialFilters?.price || "Any");
  const [vegOnly, setVegOnly] = useState(initialFilters?.vegOnly || false);

  const slide = useRef(new Animated.Value(350)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slide, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 150,
      }).start();
    } else {
      slide.setValue(350);
    }
  }, [visible, slide]);

  const reset = () => {
    setSort("Relevance");
    setCuisine("All");
    setPrice("Any");
    setVegOnly(false);
  };

  const OptionGroup = ({ title, options, value, onSelect }) => (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.75}
              onPress={() => onSelect(option)}
              style={[styles.option, selected && styles.selectedOption]}
            >
              <Text
                style={[styles.optionText, selected && styles.selectedText]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slide }] }]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={reset}>
              <Text style={styles.reset}>Reset all</Text>
            </TouchableOpacity>
          </View>

          <OptionGroup
            title="Sort by"
            options={sorts}
            value={sort}
            onSelect={setSort}
          />

          <OptionGroup
            title="Cuisine"
            options={cuisines}
            value={cuisine}
            onSelect={setCuisine}
          />

          <OptionGroup
            title="Price for two"
            options={prices}
            value={price}
            onSelect={setPrice}
          />

          <TouchableOpacity
            style={styles.vegRow}
            onPress={() => setVegOnly((value) => !value)}
            activeOpacity={0.75}
          >
            <View>
              <Text style={styles.groupTitle}>Pure vegetarian</Text>
              <Text style={styles.vegDescription}>
                Show only vegetarian restaurants
              </Text>
            </View>
            <View style={[styles.toggle, vegOnly && styles.toggleActive]}>
              <View
                style={[styles.toggleDot, vegOnly && styles.toggleDotActive]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.applyButton}
            activeOpacity={0.85}
            onPress={() => {
              onApply({ sort, cuisine, price, vegOnly });
              onClose();
            }}
          >
            <Text style={styles.applyText}>Apply filters</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(36, 20, 10, 0.42)",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 5,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.ink,
  },
  reset: {
    color: colors.orange,
    fontWeight: "800",
    fontSize: 12,
  },
  group: { marginBottom: 18 },
  groupTitle: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 13,
    marginBottom: 10,
  },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
  },
  selectedOption: {
    backgroundColor: colors.vanilla,
    borderColor: colors.orange,
  },
  optionText: { color: colors.muted, fontSize: 11 },
  selectedText: { color: colors.orangeDeep, fontWeight: "800" },
  vegRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  vegDescription: { fontSize: 10, color: colors.muted, marginTop: 3 },
  toggle: {
    width: 45,
    height: 25,
    borderRadius: 15,
    backgroundColor: colors.border,
    padding: 3,
    justifyContent: "center",
  },
  toggleActive: { backgroundColor: colors.orange },
  toggleDot: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  toggleDotActive: { alignSelf: "flex-end" },
  applyButton: {
    height: 49,
    borderRadius: 15,
    backgroundColor: colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: { color: colors.white, fontWeight: "900", fontSize: 13 },
});
