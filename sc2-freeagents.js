
handlers.GetFreeAgentSecondTryPrice = function(args)
{
	var GetTitleDataRequest = {
		"Keys": ["playerTokenData"]
	};
	var GetTitleDataResult = server.GetTitleData(GetTitleDataRequest);
	var playerTokenData = JSON.parse(GetTitleDataResult.Data["playerTokenData"]);
	
	var numTries = 1;
	if (args && args.hasOwnProperty("tries"))
	{
		if (args.tries > numTries)
		{
			numTries = args.tries;
		}
	}

	var priceMultiplier = 50;
	if (playerTokenData.hasOwnProperty("freeAgentSecondTryPriceMultiplier"))
	{
		priceMultiplier = playerTokenData.freeAgentSecondTryPriceMultiplier;
	}


	var pack = "Bronze";
	if (args && args.hasOwnProperty("pk"))
	{
		pack = args.pk;
	}

	log.info("PACK NAME " + pack);
	log.info("PACK BRONZE PRICE " + playerTokenData["FreeAgentSecondTryPriceBronze"]);

	var priceOfTry = 1000;
	priceOfTry = parseInt(playerTokenData["FreeAgentSecondTryPriceBronze"]);

	var finalPriceOfSecondTry = priceMultiplier * numTries * priceOfTry;

	return JSON.stringify(1222);
};



// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================
// =======================================================================================