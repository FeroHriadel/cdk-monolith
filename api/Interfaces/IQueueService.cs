namespace Api.Interfaces;



public interface IQueueService
{
    void Publish(string message);
}
