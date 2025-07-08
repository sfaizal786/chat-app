import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx"
import {Input} from '@/components/ui/input.tsx';


import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS,} from '../../../../../../utils/constant.js';
import {  apiClient } from '@/lib/api-client.js';
import { SEARCH_CONTACTS_ROUTH } from "../../../../../../utils/constant.js";
import { useAppStore } from "../../../../../../store/index.js";
import {getColor} from '@/lib/utils.js';
import {Button} from'@/components/ui/button.tsx';
import {MultipleSelector} from "@/components/ui/multipleselect.jsx"



function CreateChannel() {
  const {  setSelectedChatData, setSelectedChatType, addChannel} = useAppStore();
        const [NewChannelModal, setNewChannelModal] = useState(false);
        const [allContacts, setallContacts] = useState([]);
        const [selectedContacts, setselectedContacts] = useState([]);
        const [channelName, setchannelName] = useState("");

         useEffect(()=>{
          const getData = async () =>{
            const response = await apiClient.get(GET_ALL_CONTACTS,{
              withCredentials:true,
            });
                setallContacts(response.data.contacts);

          };
          getData();
         },  []);

         const createChannel = async () =>{
          try{
            if(channelName.length > 0 && selectedContacts.length >0 ){

            const response = await apiClient.post(CREATE_CHANNEL_ROUTE,{
              name:channelName,
              members:selectedContacts.map((contact)=> contact.value),
            },
            {withCredentials:true});
            if(response.status === 201){
              setchannelName("");
              setselectedContacts([]);
              setNewChannelModal(false);
            

            }
          }
          }catch(error){
            console.log({error});
          }
         };
     
  
    
  return (
    <>
    <Tooltip>
  <TooltipTrigger>
  <span
    onClick={() => setNewChannelModal(true)}
    className="text-neutral-400 font-light text-opacity-90 text-sm 
               hover:text-neutral-100 cursor-pointer transition-all duration-300"
  >
    <FaPlus />
  </span>
</TooltipTrigger>

  <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
   Create New Channel
  </TooltipContent>
</Tooltip>
<Dialog open={NewChannelModal} onOpenChange={setNewChannelModal}>
  <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
    <DialogHeader>
      <DialogTitle> Please Enter Details for New Channel</DialogTitle>
      <DialogDescription>
      
      </DialogDescription>
    </DialogHeader>
    <div>
      <Input 
      placeholder="Channel Name"
       className="rounded-lg p-6 bg-[#2c2a3b] border-none"              
       onChange={e=> setchannelName(e.target.value)}
       value={channelName}
       />
    </div>
    <div>
      <MultipleSelector 
      className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
            defaultOptions ={allContacts}
      placeholder="Search Contacts"
      value={selectedContacts}
      onChange={setselectedContacts}
      emptyIndicator={
        <p className="text-center text-lg leading-10 text-gray-600">No Data Found</p>
      }
      />
    </div>
    <div>
      <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={createChannel}>Create Channel</Button>
    </div>
 
  </DialogContent>
</Dialog>
    
    </>
  )
}

export default CreateChannel