import { KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import io from "socket.io-client";
import { useAccount } from "wagmi";
import { useEnsName } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address } from "~~/components/scaffold-eth";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

type ChatMessage = {
  user: string;
  text: string;
};
type ChatUsernameProps = {
  address: string;
};

const ChatUsername: React.FC<ChatUsernameProps> = ({ address }) => {
  const [displayName, setDisplayName] = useState("");

  // Call useEnsName with only the address
  const { data: ensName } = useEnsName({ address });

  useEffect(() => {
    setDisplayName(ensName || `${address.slice(0, 6)}...${address.slice(-4)}`);
  }, [address, ensName]);

  const etherscanUrl = `https://etherscan.io/address/${address}`;
  return (
    <a href={etherscanUrl} target="_blank" rel="noopener noreferrer" className="chat-username-link">
      {displayName}
    </a>
  );
};

const ChatBox: NextPage = () => {
  const { address } = useAccount();
  const socketRef = useRef<any>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [userCount, setUserCount] = useState(0);

  //-----This is for token gating----//
  //   const tokenBalance = useScaffoldContractRead({
  //     contractName: "OS", // Replace with your ERC-20 token contract name
  //     functionName: "balanceOf",
  //     args: [address],
  //   });

  //   const hasEnoughTokens = tokenBalance.data && parseFloat(tokenBalance.data.toString()) >= 10;

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("user count", (count: number) => {
      setUserCount(count);
    });

    socketRef.current.on("chat history", (history: ChatMessage[]) => {
      setChat(history);
    });

    socketRef.current.on("receive message", (newMessage: ChatMessage) => {
      setChat(prevChat => [...prevChat, newMessage]);
    });

    return () => {
      socketRef.current.off("receive message");
      socketRef.current.off("chat history");
      socketRef.current.close();
    };
  }, []);

  const handleSendMessage = () => {
    // if (!hasEnoughTokens) {
    //   alert("You need at least 1000 tokens to send messages.");
    //   return;
    // }
    const simpleMessage = { user: address, text: message };

    if (socketRef.current && address && message.trim()) {
      socketRef.current.emit("send message", simpleMessage);
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      const chatBox = chatBoxRef.current;
      // Immediately scroll to the bottom of the chat box
      chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
    }
  }, [chat]); // Dependency on chat to trigger when it updates

  //bg-[url('/path-to-your-background-image.jpg')] put it in the second div for change up
  return (
    <div className="flex flex-col">
      {/* User Count Section */}
      <div className="user-count m-auto">
        <h2>People Hangin: {userCount}</h2>
      </div>

      {/* Header */}
      {/* ... your header component ... */}

      {/* Chat Container */}
      <div ref={chatBoxRef} className="flex-1 fixed bottom-20 left-0 right-0 overflow-auto max-h-[50vh]">
        {/* Chat messages */}
        {chat.map((msg, index) => (
          <div key={index} className="chat-message text-black bg-[#F0E6D6] p-2 m-2 rounded">
            <ChatUsername address={msg.user} />: <span>{msg.text}</span>
          </div>
        ))}
        {/* Message Input */}
        {/* {address && hasEnoughTokens && ( */}
        <div className="p-4 bg-white shadow-md">
          <input
            type="text"
            value={message}
            className="input text-black bg-[#FFF8F0] border-2 border-[#A67B5B] w-full"
            onChange={e => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} className="btn bg-[#A67B5B] text-black mt-1">
            Send
          </button>
        </div>
        {/* {!hasEnoughTokens && (
        <div className="p-4 text-center">
          You need at least 1000 tokens to participate in the chat.
        </div>
      )} */}
      </div>
    </div>
  );
};

export default ChatBox;
