import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, View } from "react-native";
import { Appbar, TextInput, Button, Text } from "react-native-paper";
import { auth } from "../config/firebaseConfig";
import { updateProfile } from "firebase/auth";
import theme from "@/config/theme";
import { useRouter } from "expo-router";

import styles from "@/assets/styles";

export default function ProfileScreen() {
  const router = useRouter();
  const currentUser = auth.currentUser;
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await updateProfile(currentUser, { displayName, photoURL });
      setMessage("Perfil atualizado com sucesso.");
    } catch (error: any) {
      setMessage("Erro ao atualizar: " + error.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={styles.appbar}>
              <Appbar.BackAction onPress={() => router.back()} />
              <Appbar.Content title="Perfil" />
            </Appbar.Header>
            <View style={{ marginHorizontal: 20 }}>
                <TextInput
                  placeholder="Nome"
                  value={displayName}
                  onChangeText={setDisplayName}
                  style={styles.input}
                  mode="outlined"
                  outlineColor={theme.colors.surface}
                  outlineStyle={{ borderRadius: 30 }}
                />
                <TextInput
                  placeholder="E-mail"
                  value={email}
                  disabled
                  mode="outlined"
                  outlineColor={theme.colors.surface}
                  style={styles.input}
                  outlineStyle={{ borderRadius: 30 }}
                />
                <TextInput
                  placeholder="URL da Foto"
                  value={photoURL}
                  onChangeText={setPhotoURL}
                  mode="outlined"
                  outlineColor={theme.colors.surface}
                  style={styles.input}
                  outlineStyle={{ borderRadius: 30 }}
                />
            </View>

            {message ? <Text style={{ marginBottom: 10 }}>{message}</Text> : null}
            <Button mode="contained" onPress={handleSave} loading={loading}>
              Salvar
            </Button>
    </SafeAreaView>
  );
}