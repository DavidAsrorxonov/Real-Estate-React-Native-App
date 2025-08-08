import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-bold text-lg bg-green-600 my-10">
        Welcome to Real Estate App
      </Text>
      <Link href={"/sign-in"}>Sign In</Link>
      <Link href={"/(root)/(tabs)/explote"}>Explore</Link>
      <Link href={"/profile"}>Profile</Link>
      <Link href={"/properties/1"}>Property</Link>
    </View>
  );
}
