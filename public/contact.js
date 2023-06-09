// Fetch the JSON data from the "/agents" endpoint
fetch("/agents")
.then((response) => response.json())
.then((jsonData) => {
  // Populate dropdown with Agent IDs
  var agentSelect = document.getElementById("agentSelect");
  jsonData.forEach(function (agent) {
    var option = document.createElement("option");
    option.value = agent.AgentId;
    option.text = agent.AgentId;
    agentSelect.appendChild(option);
  });

  // Event listener for dropdown selection
  agentSelect.addEventListener("change", function () {
    var selectedAgentId = parseInt(this.value);
    var selectedAgent = jsonData.find(function (agent) {
      return agent.AgentId === selectedAgentId;
    });

    if (selectedAgent) {
      displayAgentInfo(selectedAgent);
    } else {
      resetAgentInfo();
    }
  });

  // Display agent information
  function displayAgentInfo(agent) {
    var agentName = document.getElementById("agentName");
    var agentPosition = document.getElementById("agentPosition");
    var agentEmail = document.getElementById("agentEmail");
    var agentPhone = document.getElementById("agentPhone");
    var agentInfo = document.getElementById("agentInfo");

    agentName.textContent =
      agent.AgtFirstName +
      " " +
      (agent.AgtMiddleInitial ? agent.AgtMiddleInitial + " " : "") +
      agent.AgtLastName;
    agentPosition.textContent = agent.AgtPosition;
    agentEmail.textContent = "Email: " + agent.AgtEmail;
    agentPhone.textContent = "Phone: " + agent.AgtBusPhone;

    agentInfo.style.display = "block";
  }

  // Reset agent information
  function resetAgentInfo() {
    var agentInfo = document.getElementById("agentInfo");
    agentInfo.style.display = "none";
  }
})
.catch((error) => {
  console.log("Error fetching JSON data:", error);
});