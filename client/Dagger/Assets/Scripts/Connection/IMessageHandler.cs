public interface IMessageHandler
{
    MessageCode MessageCode { get; }
    void HandleMessage(JSONObject message);
}
