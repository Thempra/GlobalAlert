using System;
using System.IO;
using System.Net;
using System.Runtime.Serialization;
using WP7CordovaClassLib.Cordova;
using WP7CordovaClassLib.Cordova.Commands;
using WP7CordovaClassLib.Cordova.JSON;


namespace Cordova.Extension.Commands //namespace is predefined, don't change it!
{
    public class Cdc : BaseCommand //Cross domain call
    {
        [DataContract]
        public class CdcOptions
        {
            [DataMember(Name = "path")]
            public string Path { get; set; }
        }

        public void Call(string args)
        {
            CdcOptions options = JsonHelper.Deserialize<CdcOptions>(args);

            var url = new Uri(options.Path, UriKind.Absolute);

            var webClient = new WebClient();

            webClient.OpenReadCompleted += (s, e) =>
            {
                if (e.Error != null)
                {
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, "Error"));
                    return;
                }

                //Stream -> string
                var sr = new StreamReader(e.Result);
                var result = sr.ReadToEnd();

                DispatchCommandResult(
                    new PluginResult(PluginResult.Status.OK, result));
            };

            webClient.OpenReadAsync(url, url);

        }
        
    }
}