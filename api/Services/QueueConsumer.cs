using Api.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;


namespace Api.Services



{
  public class QueueConsumer : BackgroundService
  {
    private readonly RabbitMqSettings _settings;
    private IConnection _connection;
    private IModel _channel;


    // CONSTRUCTOR
    public QueueConsumer(IOptions<RabbitMqSettings> options)
    {
      _settings = options.Value;

      var factory = new ConnectionFactory()
      {
        HostName = _settings.Host,
        Port = _settings.Port,
        UserName = _settings.Username,
        Password = _settings.Password
      };

      _connection = factory.CreateConnection();
      _channel = _connection.CreateModel();

      _channel.QueueDeclare(
          queue: _settings.Queue,
          durable: false,
          exclusive: false,
          autoDelete: false,
          arguments: null);
    }


    // EXECUTION
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
      var consumer = new EventingBasicConsumer(_channel);
      consumer.Received += (model, ea) =>
      {
        var body = ea.Body.ToArray();
        var message = Encoding.UTF8.GetString(body);

        // 👉 Handle the message here
        Console.WriteLine($"[x] Received: {message}");
      };

      _channel.BasicConsume(
          queue: _settings.Queue,
          autoAck: true,
          consumer: consumer);

      return Task.CompletedTask;
    }


    // CLEANUP
    public override void Dispose()
    {
      _channel?.Close(); //close mq channel
      _connection?.Close(); //close connection to mq
      base.Dispose(); //base class dispose
    }
  }
}
