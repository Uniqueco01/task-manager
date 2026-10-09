import { create } from "zustand";
import { account } from "../lib/appwrite";
import { GetProfile } from "../lib/actions";

const useUserStore = create((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    const user = await GetProfile(); // null when nobody is logged in
    set({ user, loading: false });
  },

  logout: async () => {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch (error) {
      console.error(error);
    }
    set({ user: null });
  },
}));

export default useUserStore;
