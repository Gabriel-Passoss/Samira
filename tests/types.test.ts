import { describe, it, expect } from 'vitest';
import {
  ChampionSchema,
  SummonerSchema,
  MatchSchema,
  LeagueEntrySchema,
  AccountSchema,
  ChampionMasterySchema,
  CurrentGameSchema,
  BaseApiResponse,
} from '../src/types';

describe('Zod Schemas', () => {
  describe('BaseApiResponse', () => {
    it('should validate valid base API response', () => {
      const validResponse = {
        status: 200,
        message: 'Success',
      };

      const result = BaseApiResponse.parse(validResponse);
      expect(result.status).toBe(200);
      expect(result.message).toBe('Success');
    });

    it('should validate response without message', () => {
      const validResponse = {
        status: 404,
      };

      const result = BaseApiResponse.parse(validResponse);
      expect(result.status).toBe(404);
      expect(result.message).toBeUndefined();
    });

    it('should reject invalid response', () => {
      const invalidResponse = {
        status: 'not-a-number',
      };

      expect(() => BaseApiResponse.parse(invalidResponse)).toThrow();
    });
  });

  describe('ChampionSchema', () => {
    it('should validate valid champion data', () => {
      const validChampion = {
        id: 'Annie',
        key: '1',
        name: 'Annie',
        title: 'the Dark Child',
        blurb: 'Dangerous, but disarmingly precocious...',
        info: {
          attack: 2,
          defense: 3,
          magic: 10,
          difficulty: 6,
        },
        image: {
          full: 'Annie.png',
          sprite: 'champion0.png',
          group: 'champion',
          x: 0,
          y: 0,
          w: 48,
          h: 48,
        },
        tags: ['Mage'],
        partype: 'Mana',
        skins: [
          {
            id: '1000',
            num: 0,
            name: 'Annie',
            chromas: false,
          }
        ],
        lore: 'Dangerous, but disarmingly precocious, Annie is a child mage with immense pyromantic power.',
        allytips: ['Use your Q to farm minions and gain mana back.'],
        enemytips: ['Stay away from Annie when her stun is ready.'],
        spells: [
          {
            id: 'AnnieQ',
            name: 'Disintegrate',
            description: 'Annie hurls a mana-infused fireball.',
            tooltip: 'Annie hurls a mana-infused fireball.',
            leveltip: { label: ['Damage'], effect: ['80/115/150/185/220'] },
            maxrank: 5,
            cooldown: [4, 4, 4, 4, 4],
            cooldownBurn: '4',
            cost: [60, 65, 70, 75, 80],
            costBurn: '60/65/70/75/80',
            effect: [[0], [0], [0], [0], [0]],
            effectBurn: ['0', '0', '0', '0', '0'],
            costType: 'Mana',
            maxammo: '-1',
            range: [0],
            rangeBurn: '0',
            image: { full: 'AnnieQ.png', sprite: 'spell0.png', group: 'spell', x: 0, y: 0, w: 48, h: 48 },
            resource: 'Mana'
          }
        ],
        passive: { name: 'Pyromania', description: 'After casting 4 spells, Annie\'s next offensive spell will stun the target.', image: { full: 'Annie_Passive.png', sprite: 'passive0.png', group: 'passive', x: 0, y: 0, w: 48, h: 48 } },
        stats: {
          hp: 524,
          hpperlevel: 88,
          mp: 418,
          mpperlevel: 25,
          movespeed: 335,
          armor: 19,
          armorperlevel: 4,
          spellblock: 30,
          spellblockperlevel: 0,
          attackrange: 575,
          hpregen: 5.5,
          hpregenperlevel: 0.55,
          mpregen: 8,
          mpregenperlevel: 0.8,
          crit: 0,
          critperlevel: 0,
          attackdamage: 50,
          attackdamageperlevel: 2.63,
          attackspeedperlevel: 1.36,
          attackspeed: 0.579,
        },
      };

      const result = ChampionSchema.parse(validChampion);
      expect(result.id).toBe('Annie');
      expect(result.tags).toContain('Mage');
      expect(result.stats.hp).toBe(524);
    });

    it('should reject invalid champion data', () => {
      const invalidChampion = {
        id: 'Annie',
        // Missing required fields
      };

      expect(() => ChampionSchema.parse(invalidChampion)).toThrow();
    });
  });

  describe('SummonerSchema', () => {
    it('should validate valid summoner data', () => {
      const validSummoner = {
        profileIconId: 1234,
        revisionDate: 1640995200000,
        puuid: 'encrypted-puuid',
        summonerLevel: 30,
      };

      const result = SummonerSchema.parse(validSummoner);
      expect(result.profileIconId).toBe(1234);
      expect(result.summonerLevel).toBe(30);
    });
  });

  describe('MatchSchema', () => {
    it('should validate valid match data', () => {
      const validMatch = {
        metadata: {
          dataVersion: '2',
          matchId: 'NA1_1234567890',
          participants: ['encrypted-puuid-1', 'encrypted-puuid-2'],
        },
        info: {
          gameCreation: 1640995200000,
          gameDuration: 1800,
          gameEndTimestamp: 1640997000000,
          gameId: 1234567890,
          gameMode: 'CLASSIC',
          gameName: 'game_name',
          gameStartTimestamp: 1640995200000,
          gameType: 'MATCHED_GAME',
          gameVersion: '12.1.1.1',
          mapId: 11,
          participants: [
            {
              assists: 5,
              baronKills: 0,
              bountyLevel: 0,
              champExperience: 15000,
              champLevel: 18,
              championId: 1,
              championName: 'Annie',
              championTransform: 0,
              consumablesPurchased: 3,
              damageDealtToBuildings: 1000,
              damageDealtToObjectives: 2000,
              damageDealtToTurrets: 1000,
              damageSelfMitigated: 500,
              deaths: 3,
              detectorWardsPlaced: 5,
              doubleKills: 0,
              dragonKills: 0,
              firstBloodAssist: false,
              firstBloodKill: false,
              firstTowerAssist: false,
              firstTowerKill: false,
              gameEndedInEarlySurrender: false,
              gameEndedInSurrender: false,
              goldEarned: 12000,
              goldSpent: 11000,
              individualPosition: 'MIDDLE',
              inhibitorKills: 0,
              inhibitorTakedowns: 0,
              inhibitorsLost: 0,
              item0: 1056,
              item1: 3020,
              item2: 3089,
              item3: 0,
              item4: 0,
              item5: 0,
              item6: 3340,
              itemsPurchased: 6,
              killingSprees: 1,
              kills: 8,
              lane: 'MIDDLE',
              largestCriticalStrike: 0,
              largestKillingSpree: 3,
              largestMultiKill: 1,
              longestTimeSpentLiving: 300,
              magicDamageDealt: 25000,
              magicDamageDealtToChampions: 20000,
              magicDamageTaken: 8000,
              neutralMinionsKilled: 120,
              nexusKills: 1,
              nexusLost: 0,
              nexusTakedowns: 1,
              objectivesStolen: 0,
              objectivesStolenAssists: 0,
              participantId: 1,
              pentaKills: 0,
              perks: {
                statPerks: {
                  defense: 5002,
                  flex: 5008,
                  offense: 5005,
                },
                styles: [
                  {
                    description: 'primaryStyle',
                    selections: [
                      {
                        perk: 8124,
                        var1: 0,
                        var2: 0,
                        var3: 0,
                      },
                    ],
                    style: 8100,
                  },
                ],
              },
              physicalDamageDealt: 5000,
              physicalDamageDealtToChampions: 3000,
              physicalDamageTaken: 12000,
              profileIcon: 1234,
              puuid: 'encrypted-puuid-1',
              quadraKills: 0,
              riotIdName: 'TestSummoner',
              riotIdTagline: 'NA1',
              role: 'SOLO',
              sightWardsBoughtInGame: 0,
              spell1Casts: 50,
              spell2Casts: 30,
              spell3Casts: 20,
              spell4Casts: 10,
              summoner1Casts: 5,
              summoner1Id: 4,
              summoner2Casts: 3,
              summoner2Id: 12,
              summonerId: 'encrypted-summoner-id',
              summonerLevel: 30,
              summonerName: 'TestSummoner',
              teamEarlySurrendered: false,
              teamId: 100,
              teamPosition: 'MIDDLE',
              timeCCingOthers: 45,
              timePlayed: 1800,
              totalDamageDealt: 30000,
              totalDamageDealtToChampions: 23000,
              totalDamageShieldedOnTeammates: 0,
              totalDamageTaken: 20000,
              totalHeal: 5000,
              totalHealsOnTeammates: 0,
              totalMinionsKilled: 200,
              totalTimeCCDealt: 120,
              totalTimeDead: 60,
              totalUnitsHealed: 1,
              tripleKills: 0,
              trueDamageDealt: 0,
              trueDamageDealtToChampions: 0,
              trueDamageTaken: 0,
              turretKills: 2,
              turretTakedowns: 3,
              turretsLost: 0,
              unrealKills: 0,
              visionScore: 25,
              visionWardsBoughtInGame: 0,
              wardsKilled: 3,
              wardsPlaced: 8,
              win: true,
              challenges: {
                "12AssistStreakCount": 0,
                baronBuffGoldAdvantageOverThreshold: 0,
                controlWardTimeCoverageInRiverOrEnemyHalf: 0,
                earliestBaron: 0,
                earliestDragonTakedown: 0,
                earlyLaningPhaseGoldExpAdvantage: 0,
                fasterSupportQuestCompletion: 0,
                fastestLegendary: 0,
                hadAfkTeammate: 0,
                highestChampionDamage: 0,
                highestCrowdControlScore: 0,
                highestWardKills: 0,
                junglerKillsEarlyJungle: 0,
                killsOnLanersEarlyJungleAsJungler: 0,
                laningPhaseGoldExpAdvantage: 0,
                legendaryCount: 0,
                maxCsAdvantageOnLaneOpponent: 0,
                maxLevelLeadLaneOpponent: 0,
                mostWardsDestroyedOneSweeper: 0,
                mythicItemUsed: 0,
                playedChampSelectPosition: 0,
                soloTurretsLategame: 0,
                takedownsFirst25Minutes: 0,
                teleportTakedowns: 0,
                thirdInhibitorDestroyedTime: 0,
                threeWardsOneSweeperCount: 0,
                visionScoreAdvantageLaneOpponent: 0,
                InfernalScalePickup: 0,
                fistBumpParticipation: 0,
                voidMonsterKill: 0,
                abilityUses: 0,
                acesBefore15Minutes: 0,
                alliedJungleMonsterKills: 0,
                baronTakedowns: 0,
                blastConeOppositeOpponentCount: 0,
                bountyGold: 0,
                buffsStolen: 0,
                completeSupportQuestInTime: 0,
                controlWardsPlaced: 0,
                damagePerMinute: 0,
                damageTakenOnTeamPercentage: 0,
                dancedWithRiftHerald: 0,
                deathsByEnemyChamps: 0,
                dodgeSkillShotsSmallWindow: 0,
                doubleAces: 0,
                dragonTakedowns: 0,
                effectiveHealAndShielding: 0,
                elderDragonKillsWithOpposingSoul: 0,
                elderDragonMultikills: 0,
                enemyChampionImmobilizations: 0,
                enemyJungleMonsterKills: 0,
                epicMonsterKillsNearEnemyJungler: 0,
                epicMonsterKillsWithin30SecondsOfSpawn: 0,
                epicMonsterSteals: 0,
                epicMonsterStolenWithoutSmite: 0,
                firstTurretKilled: 0,
                firstTurretKilledTime: 0,
                flawlessAces: 0,
                fullTeamTakedown: 0,
                gameLength: 0,
                getTakedownsInAllLanesEarlyJungleAsLaner: 0,
                goldPerMinute: 0,
                hadOpenNexus: 0,
                immobilizeAndKillWithAlly: 0,
                initialBuffCount: 0,
                initialCrabCount: 0,
                jungleCsBefore10Minutes: 0,
                junglerTakedownsNearDamagedEpicMonster: 0,
                kda: 0,
                killAfterHiddenWithAlly: 0,
                killedChampTookFullTeamDamageSurvived: 0,
                killingSprees: 0,
                killParticipation: 0,
                killsNearEnemyTurret: 0,
                killsOnOtherLanesEarlyJungleAsLaner: 0,
                killsOnRecentlyHealedByAramPack: 0,
                killsUnderOwnTurret: 0,
                killsWithHelpFromEpicMonster: 0,
                knockEnemyIntoTeamAndKill: 0,
                kTurretsDestroyedBeforePlatesFall: 0,
                landSkillShotsEarlyGame: 0,
                laneMinionsFirst10Minutes: 0,
                lostAnInhibitor: 0,
                maxKillDeficit: 0,
                mejaisFullStackInTime: 0,
                moreEnemyJungleThanOpponent: 0,
                multiKillOneSpell: 0,
                multikills: 0,
                multikillsAfterAggressiveFlash: 0,
                multiTurretRiftHeraldCount: 0,
                outerTurretExecutesBefore10Minutes: 0,
                outnumberedKills: 0,
                outnumberedNexusKill: 0,
                perfectDragonSoulsTaken: 0,
                perfectGame: 0,
                pickKillWithAlly: 0,
                poroExplosions: 0,
                quickCleanse: 0,
                quickFirstTurret: 0,
                quickSoloKills: 0,
                riftHeraldTakedowns: 0,
                saveAllyFromDeath: 0,
                scuttleCrabKills: 0,
                shortestTimeToAceFromFirstTakedown: 0,
                skillshotsDodged: 0,
                skillshotsHit: 0,
                snowballsHit: 0,
                soloBaronKills: 0,
                soloKills: 0,
                stealthWardsPlaced: 0,
                survivedSingleDigitHpCount: 0,
                survivedThreeImmobilizesInFight: 0,
                takedownOnFirstTurret: 0,
                takedowns: 0,
                takedownsAfterGainingLevelAdvantage: 0,
                takedownsBeforeJungleMinionSpawn: 0,
                takedownsFirstXMinutes: 0,
                takedownsInAlcove: 0,
                takedownsInEnemyFountain: 0,
                teamBaronKills: 0,
                teamDamagePercentage: 0,
                teamElderDragonKills: 0,
                teamRiftHeraldKills: 0,
                tookLargeDamageSurvived: 0,
                turretPlatesTaken: 0,
                turretsTakenWithRiftHerald: 0,
                turretTakedowns: 0,
                twentyMinionsIn3SecondsCount: 0,
                twoWardsOneSweeperCount: 0,
                unseenRecalls: 0,
                visionScorePerMinute: 0,
                wardsGuarded: 0,
                wardTakedowns: 0,
                wardTakedownsBefore20M: 0,
              },
              missions: {
                playerScore0: 0,
                playerScore1: 0,
                playerScore2: 0,
                playerScore3: 0,
                playerScore4: 0,
                playerScore5: 0,
                playerScore6: 0,
                playerScore7: 0,
                playerScore8: 0,
                playerScore9: 0,
                playerScore10: 0,
                playerScore11: 0,
              },
            },
          ],
          platformId: 'NA1',
          queueId: 420,
          teams: [
            {
              bans: [
                {
                  championId: 55,
                  pickTurn: 1,
                },
              ],
              objectives: {
                baron: {
                  first: false,
                  kills: 0,
                },
                champion: {
                  first: false,
                  kills: 0,
                },
                dragon: {
                  first: false,
                  kills: 0,
                },
                inhibitor: {
                  first: false,
                  kills: 0,
                },
                riftHerald: {
                  first: false,
                  kills: 0,
                },
                tower: {
                  first: false,
                  kills: 0,
                },
              },
              teamId: 100,
              win: true,
            },
          ],
        },
      };

      const result = MatchSchema.parse(validMatch);
      expect(result.metadata.matchId).toBe('NA1_1234567890');
      expect(result.info.participants).toHaveLength(1);
      expect(result.info.teams).toHaveLength(1);
    });
  });

  describe('LeagueEntrySchema', () => {
    it('should validate valid league entry data', () => {
      const validLeagueEntry = {
        leagueId: 'league-id-123',
        puuid: 'encrypted-puuid',
        queueType: 'RANKED_SOLO_5x5',
        tier: 'GOLD',
        rank: 'II',
        leaguePoints: 75,
        wins: 15,
        losses: 10,
        hotStreak: false,
        veteran: false,
        freshBlood: false,
        inactive: false,
      };

      const result = LeagueEntrySchema.parse(validLeagueEntry);
      expect(result.tier).toBe('GOLD');
      expect(result.rank).toBe('II');
      expect(result.leaguePoints).toBe(75);
    });

    it('should validate league entry with mini series', () => {
      const validLeagueEntryWithSeries = {
        leagueId: 'league-id-123',
        puuid: 'encrypted-puuid',
        queueType: 'RANKED_SOLO_5x5',
        tier: 'SILVER',
        rank: 'I',
        leaguePoints: 100,
        wins: 20,
        losses: 15,
        hotStreak: false,
        veteran: false,
        freshBlood: false,
        inactive: false,
        miniSeries: {
          losses: 1,
          progress: 'WLW',
          target: 3,
          wins: 2,
        },
      };

      const result = LeagueEntrySchema.parse(validLeagueEntryWithSeries);
      expect(result.miniSeries?.progress).toBe('WLW');
      expect(result.miniSeries?.target).toBe(3);
    });
  });

  describe('AccountSchema', () => {
    it('should validate valid account data', () => {
      const validAccount = {
        puuid: 'encrypted-puuid',
        gameName: 'TestSummoner',
        tagLine: 'NA1',
      };

      const result = AccountSchema.parse(validAccount);
      expect(result.gameName).toBe('TestSummoner');
      expect(result.tagLine).toBe('NA1');
    });
  });

  describe('ChampionMasterySchema', () => {
    it('should validate valid champion mastery data', () => {
      const validMastery = {
        championId: 1,
        championLevel: 7,
        championPoints: 50000,
        lastPlayTime: 1640995200000,
        championPointsSinceLastLevel: 20000,
        championPointsUntilNextLevel: 0,
        chestGranted: true,
        tokensEarned: 2,
        summonerId: 'encrypted-summoner-id',
      };

      const result = ChampionMasterySchema.parse(validMastery);
      expect(result.championLevel).toBe(7);
      expect(result.championPoints).toBe(50000);
      expect(result.chestGranted).toBe(true);
    });
  });

  describe('CurrentGameSchema', () => {
    it('should validate valid current game data', () => {
      const validCurrentGame = {
        gameId: 1234567890,
        gameType: 'MATCHED_GAME',
        gameStartTime: 1640995200000,
        mapId: 11,
        gameLength: 300,
        platformId: 'NA1',
        gameMode: 'CLASSIC',
        bannedChampions: [
          {
            championId: 55,
            teamId: 100,
            pickTurn: 1,
          },
        ],
        gameQueueConfigId: 420,
        observers: {
          encryptionKey: 'encryption-key',
        },
        participants: [
          {
            teamId: 100,
            spell1Id: 4,
            spell2Id: 12,
            championId: 1,
            profileIconId: 1234,
            bot: false,
            puuid: 'encrypted-puuid',
            perks: {
              perkIds: [5005, 5008, 5002],
              perkStyle: 5000,
              perkSubStyle: 5000,
            },
            gameCustomizationObjects: [],
          },
        ],
        gameCustomizationObjects: [],
      };

      const result = CurrentGameSchema.parse(validCurrentGame);
      expect(result.gameMode).toBe('CLASSIC');
      expect(result.participants).toHaveLength(1);
      expect(result.bannedChampions).toHaveLength(1);
    });
  });
});
