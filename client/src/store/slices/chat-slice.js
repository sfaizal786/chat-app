export const createChatSlice = (set, get) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo }),

  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],

  directMessageContacts: [],

  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,

  channels: [],
  unseenMessages: {},

  setChannels: (channels) => set({ channels }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),

  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
  setDirectMessageContacts: (directMessageContacts) => set({ directMessageContacts }),

  addUnseenMessage: (message) => set((state) => {
    const userId = get().userInfo?.id;
    if (!userId) return state;

    const chatId =
      message.sender._id === userId
        ? message.recipient?._id
        : message.sender._id;

    if (!chatId) return state;

    return {
      unseenMessages: {
        ...state.unseenMessages,
        [chatId]: (state.unseenMessages[chatId] || 0) + 1,
      },
    };
  }),

  clearUnseenMessages: (chatId) =>
    set((state) => {
      const updated = { ...state.unseenMessages };
      delete updated[chatId];
      return { unseenMessages: updated };
    }),

  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },

  addChannelInChannelList: (message) => {
    const channels = [...get().channels];
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if (index !== -1) {
      const data = channels[index];
      channels.splice(index, 1);
      if (data) {
        channels.unshift(data);
        set({ channels });
      }
    }
  },

  addContactInDMContacts: (message) => {
    const userId = get().userInfo?.id;
    if (!userId) return;

    const fromId =
      message.sender._id === userId
        ? message.recipient?._id
        : message.sender._id;

    const fromData =
      message.sender._id === userId
        ? message.recipient
        : message.sender;

    if (!fromId || !fromData) return;

    const dmContacts = [...get().directMessageContacts];
    const index = dmContacts.findIndex(
      (contact) => contact._id === fromId
    );

    if (index !== -1) {
      dmContacts.splice(index, 1);
      dmContacts.unshift(fromData);
    } else {
      dmContacts.unshift(fromData);
    }

    set({ directMessageContacts: dmContacts });
  },

  moveContactToTop: (message) => {
    const userId = get().userInfo?.id;
    if (!userId) return;

    const fromId =
      message.sender._id === userId
        ? message.recipient?._id
        : message.sender._id;

    const fromData =
      message.sender._id === userId
        ? message.recipient
        : message.sender;

    if (!fromId || !fromData) return;

    const dmContacts = [...get().directMessageContacts];
    const index = dmContacts.findIndex(
      (contact) => contact._id === fromId
    );

    if (index !== -1) {
      dmContacts.splice(index, 1);
      dmContacts.unshift(fromData);
    } else {
      dmContacts.unshift(fromData);
    }

    set({ directMessageContacts: dmContacts });
  },

  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    set({
      selectedChatMessages: [...selectedChatMessages, message],
    });
  },

  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
});
