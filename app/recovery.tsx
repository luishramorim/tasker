import React, { useState } from "react";
import { Alert, SafeAreaView, TouchableOpacity, View } from "react-native";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { resetPassword } from "@/services/authService"; 
import styles from "../assets/styles";
import theme from "../config/theme";

export default function Recovery() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }

    const error = await resetPassword(email);

    if (error) {
      Alert.alert("Erro", error);
    } else {
      Alert.alert("Sucesso", "Um e-mail de redefinição foi enviado.", [
        { text: "OK", onPress: () => router.push("/login") }
      ]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Recuperar senha" />
      </Appbar.Header>

      <View style={[styles.container]}>
        <View style={{ width: "100%", maxWidth: 480, marginHorizontal: 20, alignItems: "flex-start" }}>
          <Text variant="headlineSmall" style={styles.title}>Recupere sua senha</Text>
          <Text variant="titleMedium" style={[styles.text, {textAlign: 'left'}]}>
            Digite seu e-mail para receber um link de redefinição de senha.
          </Text>
        </View>

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

        <Button style={{ marginTop: 10 }} mode="elevated" onPress={handleResetPassword}>
            Recuperar
        </Button>
      </View>
    </SafeAreaView>
  );
}