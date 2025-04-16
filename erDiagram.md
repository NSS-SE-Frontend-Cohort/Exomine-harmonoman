``` mermaid
erDiagram

Colony ||--o{ Governor : governed_by
ColonyInventories ||--o{ Colony : has_inventory
ColonyInventories ||--o{ Mineral : contains
FacilityMinerals ||--o{ Mineral : mineral_sold
FacilityMinerals ||--o{ Facility : sold_by

Governor {
  int id pk
  varchar firstName 
  varchar lastName 
  int colonyId  
  boolean status  
}

Colony {
  int id pk
  varchar name 
}

ColonyInventories {
  int id pk
  int colonyId  
  int mineralId
  int quantity 
}

Mineral {
  int id pk
  varchar name 
}

Facility {
  int id pk
  varchar name 
  boolean status 
}

FacilityMinerals {
  int id pk
  int facilityId
  int mineralId
  int quantity 
}