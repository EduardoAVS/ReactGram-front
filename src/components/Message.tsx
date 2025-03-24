import "./Message.css";

interface MessageProps{
    msg: string;
    type: "success" | "error";
}

const Message: React.FC<MessageProps> = ({ msg, type }) => {
  return (
    <div>
        <div className={`message ${type}`}>
            <p>{msg}</p>
        </div>
    </div>
  )
}

export default Message