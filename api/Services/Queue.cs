using Api.Configuration;
using Api.Interfaces;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using System.Text;



namespace Api.Services;



public class Queue : IQueueService
{
    private readonly RabbitMqSettings _settings;

    public Queue(IOptions<RabbitMqSettings> options)
    {
        _settings = options.Value;
    }

    public void Publish(string message)
    {
        var factory = new ConnectionFactory()
        {
            HostName = _settings.Host,
            Port = _settings.Port,
            UserName = _settings.Username,
            Password = _settings.Password
        };

        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        channel.QueueDeclare(
            queue: _settings.Queue,
            durable: false,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );

        var body = Encoding.UTF8.GetBytes(message);

        channel.BasicPublish(
            exchange: "",
            routingKey: _settings.Queue,
            basicProperties: null,
            body: body
        );
    }
}
