import ChatHeader from "./components/chat-header"
import MessageBar from "./components/message-bar"
import MessageContainer from "./components/message-container"

function ChatContainer() {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:fex-1 ">
        <ChatHeader/>
        <MessageContainer/>
        <MessageBar/>
        
    </div>
  )
}

export default ChatContainer
