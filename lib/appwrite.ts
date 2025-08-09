import * as Linking from "expo-linking";
import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";

export const config = {
  platform: "com.dv.realestate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function Login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) {
      throw new Error("Login failed");
    }

    const browserResult = await (Linking as any).openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== "success") {
      throw new Error(
        "Login failed! Error in browserResult: " + JSON.stringify(browserResult)
      );
    }

    const url = new URL(browserResult.url);

    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId) {
      throw new Error("Login failed! Missing secret or userId");
    }

    const session = await account.createSession(secret, userId);

    if (!session) {
      throw new Error("Login failed! Missing session");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function Logout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getUser() {
  try {
    const response = await account.get();

    if (response.$id) {
      const userAvatar = await avatar.getInitials(response.name);

      return {
        ...response,
        avatar: userAvatar.toString(),
      };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
