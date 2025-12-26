export class ProgressStage {
    name: string;
    steps?: number;
    stepsDone: number = 0;

    constructor(name: string, steps?: number) {
        this.name = name;
        this.steps = steps;
    }

    isComplete(): boolean {
        return this.stepsDone === this.steps;
    }

    percentDone(): number {
        if (this.steps === undefined) return 0;
        if (this.steps === 0) return 100;
        return (this.stepsDone / this.steps) * 100;
    }
}

export class Progress {
    stages: ProgressStage[];
    currentStage: number = 0;

    constructor(stages: ProgressStage[]) {
        this.stages = stages;
    }

    metadataStage(): ProgressStage {
        return this.stages[0]!;
    }

    pageStage(): ProgressStage {
        return this.stages[1]!;
    }

    fontStage(): ProgressStage {
        return this.stages[2]!;
    }

    completeStage(): void {
        this.currentStage++;
    }

    isComplete(): boolean {
        return this.currentStage === this.stages.length;
    }

    activeStage(): ProgressStage {
        return this.stages[this.currentStage]!;
    }
}
