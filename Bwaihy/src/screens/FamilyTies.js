const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141E30",
  },
  addButton: {
    position: "absolute",
    bottom: 100,
    right: 24,
    backgroundColor: "#FF4F8E",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4F8E",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

{
  /* Add Family Member Modal */
}
<Modal
  animationType="fade"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Add New Family Member</Text>
      <Text style={styles.modalSubtitle}>
        Enter the Full Name of the person you want to add to your Family Ties
      </Text>
    </View>
  </View>
</Modal>;
