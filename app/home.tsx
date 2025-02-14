import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  SafeAreaView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import {
  Appbar,
  Text,
  TextInput,
  Button,
  Card,
  Avatar,
  IconButton,
  Chip,
  Menu,
  Icon,
  List,
} from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { useRouter } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { getFirestore, collection, doc, onSnapshot } from "firebase/firestore";
import { addTask } from "@/services/authService";
import styles from "../assets/styles";
import theme from "@/config/theme";
import Sidebar from "@/assets/components/Sidebar";

type Task = {
  id: string;
  title: string;
  description: string;
  reminder?: string;
};

const TaskCard = ({ task }: { task: Task }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const getReminderText = (reminder?: string) => {
    if (!reminder) return "Sem lembrete";
    const date = new Date(reminder);
    return isNaN(date.getTime())
      ? "Sem lembrete"
      : date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };
  const router = useRouter();

  return (  
    <Card onPress={() => router.push("/task")} style={styles.taskCard}>
      <Card.Title
        title={task.title}
        subtitle={`Lembrete: ${getReminderText(task.reminder)}`}
        left={(props) => (
          <Avatar.Icon {...props} icon="clipboard-check-outline" />
        )}
        right={(props) => (
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton {...props} icon="dots-vertical" onPress={openMenu} />
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
              }}
              title="Excluir"
            />
          </Menu>
        )}
      />
      {task.description ? (
        <Card.Content>
          <Text>{task.description}</Text>
        </Card.Content>
      ) : null}
    </Card>
  );
};

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const containerWidth = Math.min(screenWidth - 40, 500);
  const db = getFirestore();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const tasksRef = collection(doc(collection(db, "users"), user.uid), "tasks");
    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const updatedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(updatedTasks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    let timestamp: Date | null = null;
    if (selectedDate || selectedTime) {
      const datePart = selectedDate || new Date();
      const timePart = selectedTime || new Date(0, 0, 0, 0, 0);
      timestamp = new Date(
        datePart.getFullYear(),
        datePart.getMonth(),
        datePart.getDate(),
        timePart.getHours(),
        timePart.getMinutes()
      );
    }
    const { success, error } = await addTask(
      newTaskTitle,
      "",
      timestamp ? timestamp.toISOString() : undefined,
      []
    );
    if (success) {
      setNewTaskTitle("");
      setSelectedDate(null);
      setSelectedTime(null);
    } else {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const filteredTasks =
    isSearch && searchQuery.trim() === ""
      ? []
      : tasks.filter((task) => {
          const query = searchQuery.toLowerCase();
          return (
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
          );
        });

  const groupTasks = (taskList: Task[]) =>
    taskList.reduce((groups: { [key: string]: Task[] }, task) => {
      let groupKey = "Algum dia";
      if (task.reminder) {
        const dateObj = new Date(task.reminder);
        if (!isNaN(dateObj.getTime())) {
          groupKey = formatDate(dateObj);
        }
      }
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
      return groups;
    }, {});

  const groupedTasks = isSearch ? groupTasks(filteredTasks) : groupTasks(tasks);

  const groupKeys = Object.keys(groupedTasks).sort((a, b) => {
    if (a === "Algum dia") return 1;
    if (b === "Algum dia") return -1;
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
     <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
     <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {isSearch ? (
              <Appbar.Header mode="center-aligned" style={[styles.appbar, { alignSelf: "center" }]}>
                <View style={{ width: '90%', maxWidth: 450 }}>
                  <TextInput
                    mode="outlined"
                    outlineColor={theme.colors.surface}
                    outlineStyle={{ borderRadius: 30 }}
                    placeholder="Pesquisar tarefas"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                    style={[styles.input, { marginTop: 20, alignSelf: 'center', marginLeft: 40 }]}
                    underlineColorAndroid="transparent"
                    right={<TextInput.Icon icon="close" onPress={() => {setIsSearch(false); setSearchQuery("")}} />}
                  />
                </View>
              </Appbar.Header>
            ) : (
              <Appbar.Header mode="small" style={[styles.appbar, { alignSelf: "center" }]}>
                <Appbar.Action icon="menu" onPress={() => setSidebarOpen(true)} />
                <Appbar.Content title="Tasker" />
                <Appbar.Action icon="magnify" onPress={() => setIsSearch(true)} />
                <Appbar.Action icon="account" onPress={() => router.push("/profile")} />
              </Appbar.Header>
            )}

            <View style={{ flex: 1, marginTop: Platform.OS === "web" ? 80 : 0 }}>
              {loading ? (
                <ActivityIndicator size="large" />
              ) : isSearch && searchQuery.trim() === "" ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>
                    Nenhuma tarefa encontrada
                  </Text>
                </View>
              ) : Object.keys(groupedTasks).length === 0 ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Icon size={48} source={"clipboard-off-outline"} color={theme.colors.secondary} />
                  <Text variant="bodyLarge" style={{ marginTop: 20, textAlign: "center", color: theme.colors.secondary }}>
                    Sem tarefas no momento
                  </Text>
                </View>
              ) : (
                <ScrollView>
                  {groupKeys.map((groupKey) => (
                    <List.Accordion
                      title={groupKey}
                      id={groupKey}
                      key={groupKey}
                      expanded={true} 
                    >
                      {groupedTasks[groupKey].map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </List.Accordion>
                  ))}
                </ScrollView>
              )}
            </View>

            {!isSearch && (
              <View
                style={{
                  width: containerWidth,
                  maxWidth: 500,
                  alignSelf: "center",
                  marginBottom: 10,
                  flexDirection: "column",
                }}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipContainer}
                >
                  <Chip
                    style={styles.chip}
                    mode="outlined"
                    icon="calendar"
                    onPress={() => setDatePickerVisible(true)}
                    onClose={selectedDate ? () => setSelectedDate(null) : undefined}
                  >
                    {selectedDate ? formatDate(selectedDate) : "Data"}
                  </Chip>
                  <Chip
                    style={styles.chip}
                    mode="outlined"
                    icon="bell"
                    onPress={() => setTimePickerVisible(true)}
                    onClose={selectedTime ? () => setSelectedTime(null) : undefined}
                  >
                    {selectedTime ? formatTime(selectedTime) : "Lembrete"}
                  </Chip>
                  <Chip style={styles.chip} mode="outlined" icon="tag">
                    Tag
                  </Chip>
                </ScrollView>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                  <TextInput
                    placeholder="Nova tarefa"
                    style={[styles.input, { flex: 1 }]}
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                    mode="outlined"
                    outlineColor={theme.colors.surface}
                    outlineStyle={{ borderRadius: 30 }}
                  />
                  <Button mode="elevated" icon="plus" style={styles.addButton} onPress={handleAddTask}>
                    Nova
                  </Button>
                </View>
              </View>
            )}

            <DatePickerModal
              mode="single"
              visible={datePickerVisible}
              onDismiss={() => setDatePickerVisible(false)}
              date={selectedDate ?? new Date()}
              onConfirm={({ date }) => {
                setDatePickerVisible(false);
                if (date) {
                  setSelectedDate(new Date(date));
                }
              }}
              validRange={{
                startDate: new Date(),
                endDate: new Date(2030, 11, 31),
              }}
              locale="pt"
              label="Data"
              saveLabel="Confirmar"
              presentationStyle="pageSheet"
            />
            <TimePickerModal
              visible={timePickerVisible}
              onDismiss={() => setTimePickerVisible(false)}
              onConfirm={({ hours, minutes }) => {
                setTimePickerVisible(false);
                const time = new Date();
                time.setHours(hours);
                time.setMinutes(minutes);
                setSelectedTime(time);
              }}
              hours={selectedTime ? selectedTime.getHours() : 0}
              minutes={selectedTime ? selectedTime.getMinutes() : 0}
              label="Selecione o horário"
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}