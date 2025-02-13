import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput, Dialog, Portal, FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "../assets/styles";
import { loginUser } from "@/services/authService";
import theme from "@/config/theme";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos!");
      toggleDialog(true);
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(async () => {
      const { user, error } = await loginUser(email, password);
      setLoading(false);

      if (error) {
        setError(error);
        toggleDialog(true);
      } else {
        console.log("Usuário autenticado:", user);
      }
    }, 1000);
  };

  const toggleDialog = (visible: boolean) => {
    setDialogVisible(visible);
  };

  const toggleFab = ({ open }: { open: boolean }) => {
    setFabOpen(open);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.title}>
          Tasker<Text style={{ color: theme.colors.primary }}>{cursorVisible ? "_" : " "}</Text>
        </Text>
        <Text variant="titleMedium" style={styles.text}>Tasks made simple.</Text>
      </View>

      <TextInput
        placeholder="Email"
        mode="outlined"
        outlineColor={theme.colors.surface}
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        outlineStyle={{ borderRadius: 30 }}
      />

      <TextInput
        placeholder="Senha"
        mode="outlined"
        outlineColor={theme.colors.surface}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        outlineStyle={{ borderRadius: 30 }}
      />

      <Button disabled={loading} loading={loading} mode="elevated" style={styles.button} onPress={handleLogin}>
        Entrar
      </Button>

      <Button mode="text" style={styles.button} onPress={() => router.push("/register")}>
        Criar conta
      </Button>

      <Button mode="text" style={styles.tertiaryButton} onPress={() => router.push("/recovery")}>
        Esqueceu a senha?
      </Button>

      <Portal>
        <Dialog style={{ width: 350, alignSelf: 'center' }} visible={dialogVisible} onDismiss={() => toggleDialog(false)}>
          <Dialog.Title>Erro</Dialog.Title>
          <Dialog.Content>
            <Text>{error}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" style={{ width: 70 }} onPress={() => toggleDialog(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB.Group
        style={{ position: "absolute", right: 16 }}
        open={fabOpen}
        visible
        icon={fabOpen ? "close" : "help-circle-outline"}
        actions={[
          { icon: "github", label: "Github", onPress: () => router.push("/register") },
          { icon: "linkedin", label: "LinkedIn", onPress: () => router.push("/recovery") },
        ]}
        onStateChange={toggleFab}
      />
      </View>
  );
}