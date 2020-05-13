// (C) 2007-2018 GoodData Corporation
import { IAttributeOrMeasure, IAttribute, IFilter, newBucket, ISortItem } from "@gooddata/sdk-model";
import { BucketNames } from "@gooddata/sdk-ui";
import { roundChartDimensions } from "../_commons/dimensions";
import { IBucketChartProps } from "../../interfaces";
import { CoreFunnelChart } from "./CoreFunnelChart";
import { IChartDefinition } from "../_commons/chartDefinition";
import { withChart } from "../_base/withChart";

//
// Internals
//

const funnelChartDefinition: IChartDefinition<IFunnelChartBucketProps, IFunnelChartProps> = {
    bucketPropsKeys: ["measures", "viewBy", "filters", "sortBy"],
    bucketsFactory: props => {
        return [
            newBucket(BucketNames.MEASURES, ...props.measures),
            newBucket(BucketNames.VIEW, props.viewBy),
        ];
    },
    executionFactory: (props, buckets) => {
        const { backend, workspace } = props;

        return backend
            .withTelemetry("FunnelChart", props)
            .workspace(workspace)
            .execution()
            .forBuckets(buckets, props.filters)
            .withDimensions(roundChartDimensions);
    },
};

//
// Public interface
//

/**
 * @public
 */
export interface IFunnelChartBucketProps {
    /**
     * Specify one or more measures to chart into a funnel.
     *
     * If you specify single measure, then you can also specify the viewBy attribute. Values of that attribute
     * will be used for slicing and will be charted as a funnel.
     *
     * If you specify multiple measures, then those calculate measure values will be charted into a funnel.
     */
    measures: IAttributeOrMeasure[];

    /**
     * Optionally specify attribute that will be used to slice the single measure into multiple pieces that
     * will be charted into a funnel.
     */
    viewBy?: IAttribute;

    /**
     * Optionally specify filters to apply on the data to chart.
     */
    filters?: IFilter[];

    /**
     * Optionally specify how to sort the data to chart.
     */
    sortBy?: ISortItem[];
}

/**
 * @public
 */
export interface IFunnelChartProps extends IBucketChartProps, IFunnelChartBucketProps {}

/**
 * A funnel chart displays values as progressively decreasing proportions.
 *
 * You can define funnel chart using either multiple measures or single measure and a viewBy attribute whose
 * values will be used to slice the single measure.
 *
 * In either case, the measure values will be charted into a funnel. With the largest values being on the broadest
 * part of the funnel, and the smallest values towards the narrow part of the funnel.
 *
 * @public
 */
export const FunnelChart = withChart(funnelChartDefinition)(CoreFunnelChart);
