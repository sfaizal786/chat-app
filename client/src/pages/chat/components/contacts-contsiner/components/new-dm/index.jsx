import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import animationData from "@/assets/lottie-json";
import Lottie from "lottie-react";
import { HOST, SEARCH_CONTACTS_ROUTH } from "../../../../../../utils/constant";
import { apiClient } from "@/lib/api-client.js";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Avatar, AvatarImage } from "@/components/ui/Avatar.jsx";
import { useAppStore } from "../../../../../../store/index.js";
import { getColor } from "@/lib/utils.js";

function NewDm() {
  const { setSelectedChatData, setSelectedChatType } = useAppStore();
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [openNewContactModal, setOpenNewContactModal] = useState(false);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTH,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        } else {
          setSearchedContacts([]);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
     onsole.log({ error });
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <span
            onClick={() => setOpenNewContactModal(true)}
            className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
          >
            <FaPlus />
          </span>
        </TooltipTrigger>

        <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
          Select New Contact
        </TooltipContent>
      </Tooltip>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] max-h-[90vh] overflow-y-auto flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div>
            <Input
              placeholder="Search Contact"
              className="rounded-lg p-6 bg-[#2c2a3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px] mt-4">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName[0]
                              : contact.empid[0]}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.firstName ||
                            contact.lastName ||
                            contact.empid}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {contact.empid}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {searchedContacts.length <= 0 && (
            <div className="flex flex-col mt-5 justify-center items-center duration-1000 transition-all">
              <Lottie
                animationData={animationData}
                style={{ width: 100, height: 100 }}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi
                  <span className="text-purple-500">!</span> Search new
                  <span className="text-purple-500"> Contact </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDm;
