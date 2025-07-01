// Base Server URL
export const HOST = import.meta.env.VITE_SERVER_URL;

// -----------------------------
// Auth Routes
// -----------------------------
export const Authroutes = "api/auth/";
export const signup_route = Authroutes + 'signup';
export const login_route = Authroutes + 'login';
export const GET_USER_INFO = Authroutes + 'userinfo';
export const UPDATE_PROFILE_ROUTE = Authroutes + 'updateProfile';
export const ADD_PROFILE_IMAGE_ROUTE = Authroutes + 'addprofileimage';
export const REMOVE_PROFILE_IMAGES_ROUTE = Authroutes + 'remove-profile-image';
export const LOGOUT_ROUTE = Authroutes + 'logout';

// -----------------------------
// Contacts Routes
// -----------------------------
export const CONTACTS_ROUTE = "api/contacts/";
export const SEARCH_CONTACTS_ROUTH = CONTACTS_ROUTE + 'search';
export const GET_DM_CONTACTS_ROUTES = CONTACTS_ROUTE + 'get-contacts-for-dm';
export const GET_ALL_CONTACTS = CONTACTS_ROUTE + 'get-all-contact';

// -----------------------------
// Message Routes
// -----------------------------
export const MESSAGE_ROUTES = "api/messages/";
export const GET_ALL_MESSAGE_ROUTE = MESSAGE_ROUTES + 'get-message';
export const UPLOAD_FILE_ROUTE = MESSAGE_ROUTES + 'upload-file';
export const MARK_AS_SEEN_ROUTE = MESSAGE_ROUTES + 'mark-as-seen';

// -----------------------------
// Channel Routes
// -----------------------------
export const CHANNEL_ROUTES = "api/channel/";
export const CREATE_CHANNEL_ROUTE = CHANNEL_ROUTES + 'createchannel';
export const GET_USER_CHANNELS_ROUTE = CHANNEL_ROUTES + 'get-user-channels';
export const GET_CHANNEL_MESSAGE = CHANNEL_ROUTES + 'get-channel-message';

// -----------------------------
// Additional Exports (if needed)
// -----------------------------
// Add any other constants here as your project grows.
