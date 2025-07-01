// src/pages/chat/components/contacts-container.jsx

import meta from '@/assets/meta.jpg';
import ProfileInfo from './components/profile-info';
import NewDm from './components/new-dm';
import CreateChannel from './components/create-channel';
import { useEffect } from 'react';
import { apiClient } from '../../../../lib/api-client';
import {
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNELS_ROUTE
} from '../../../../utils/constant';
import { useAppStore } from '../../../../store';
import ContactList from '../../../../components/contact-list';
import background from '@/assets/meta.jpg';

function ContactsContainer() {
  const {
    setDirectMessageContacts,
    directMessageContacts,
    channels,
    setChannels,
    unseenMessages,
    clearUnseenMessages,
    setSelectedChatType,
    setSelectedChatData,
  } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
          withCredentials: true,
        });
        if (response.data.contacts) {
          setDirectMessageContacts(response.data.contacts);
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
          withCredentials: true,
        });
        if (response.data.channels) {
          setChannels(response.data.channels);
        }
      } catch (error) {
        console.error("Failed to fetch channels:", error);
      }
    };

    getContacts();
    getChannels();
  }, [setChannels, setDirectMessageContacts]);

  const handleContactClick = (contact, isChannel) => {
    setSelectedChatType(isChannel ? "channel" : "direct");
    setSelectedChatData(contact);

    if (!isChannel) {
      clearUnseenMessages(contact._id);
    }
  };

  return (
    <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList
            contacts={directMessageContacts}
            unseenMessages={unseenMessages}
            onClick={handleContactClick}
            isChannel={false}
          />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden ">
          <ContactList
            contacts={channels}
            unseenMessages={{}} // channels unseen logic not implemented yet
            onClick={handleContactClick}
            isChannel={true}
          />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

export default ContactsContainer;

export const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <img src={background} className='flex rounded-full h-15 w-15' />
      <span className="text-3xl font-semibold">Meta-Insyt</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90'>
      {text}
    </h6>
  );
};
