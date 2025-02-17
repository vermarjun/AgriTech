
const GraphDisplay = () => {
  const iframeLinks = [
    "https://thingspeak.com/channels/2826247/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15",
    "https://thingspeak.com/channels/2826247/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15",
    "https://thingspeak.com/channels/2826247/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15",
    "https://thingspeak.com/channels/2826247/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15",
    "https://thingspeak.com/channels/2826247/charts/5?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15",
    "https://thingspeak.com/channels/2826247/charts/6?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15",
    "https://thingspeak.com/channels/2826247/charts/7?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15",
    "https://thingspeak.com/channels/2826247/widgets/1019101",
    "https://thingspeak.com/channels/2826247/widgets/1019102",
  ];

  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-20 py-2">
        {iframeLinks.map((link, index) => (
          <div
            key={index}
            className=" bg-black bg-opacity-40 backdrop-blur-lg border border-green-950 shadow-lg rounded-2xl flex justify-center items-center"
          >
            <iframe
              src={link}
              title={`Graph ${index + 1}`}
              className="w-full h-64 rounded-lg border border-neutral-800"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphDisplay;
