import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { Appbar, Button, Text, TextInput, Checkbox } from "react-native-paper";
import styles from "../assets/styles";
import { registerUser } from "@/services/authService";
import theme from "@/config/theme";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(async () => {
      const { user, error } = await registerUser(fullName, email, password);
      setLoading(false);

      if (error) {
        setError(error);
      } else {
        console.log("Usuário cadastrado:", user);
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Criar Conta" />
      </Appbar.Header>

      <View style={[styles.container, { marginTop: 50 }]}>
        <TextInput
          placeholder="Nome Completo"
          mode="outlined"
          outlineColor={theme.colors.surface}
          outlineStyle={{ borderRadius: 30 }}
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <TextInput
          placeholder="E-mail"
          mode="outlined"
          outlineColor={theme.colors.surface}
          outlineStyle={{ borderRadius: 30 }}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Senha"
          mode="outlined"
          outlineColor={theme.colors.surface}
          outlineStyle={{ borderRadius: 30 }}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.checkboxContainer}>
          <Checkbox.Android
            status={checked ? "checked" : "unchecked"}
            onPress={() => setChecked(!checked)}
            color={theme.colors.primary}
          />
          <Text variant="bodyMedium" style={styles.checkboxText}>
            Este aplicativo é apenas para demonstração. Nenhum dado será salvo permanentemente.
          </Text>
        </View>

        <Button
          mode="elevated"
          loading={loading}
          onPress={handleRegister}
          disabled={!checked}
        >
          Criar Conta
        </Button>
      </View>
    </SafeAreaView>
  );
}