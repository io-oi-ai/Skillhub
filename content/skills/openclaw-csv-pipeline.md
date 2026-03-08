---
name: "CSV Pipeline Data Processing"
description: "Process, transform, and analyze CSV and JSON data with visualization report generation"
author: "OpenClaw Community"
roles: ["data-analyst", "operations"]
scenes: ["data-analysis", "workflow"]
version: "1.0.0"
updatedAt: "2025-02-18"
tags: ["OpenClaw", "CSV", "Data Processing", "ETL", "collection:data-finance"]
featured: false
source: "clawhub.ai"
---

# CSV Pipeline Data Processing

## Overview

CSV Pipeline is a powerful data processing skill designed for analysts and operations personnel who frequently work with structured data. It can read, clean, transform, and analyze CSV and JSON format data files, and automatically generate visualization reports, significantly reducing repetitive data processing work.

## Core Features

### Data Import and Cleaning
- Automatically identify CSV file encoding formats (UTF-8, GBK, GB2312, etc.) to avoid Chinese character corruption
- Intelligently detect and handle missing values, duplicate rows, and anomalous data
- Automatically infer column data types with support for standardizing dates, numbers, text, and other formats
- Handle multiple delimiter formats including commas, tabs, semicolons, and more

### Data Transformation and Calculation
- Support column addition, deletion, modification, renaming, and type conversion
- Built-in common aggregation functions: sum, average, count, group statistics
- Support multi-table association merging (join) similar to SQL data operations
- Generate pivot tables for quick multi-dimensional cross-analysis

### Visualization Reports
- Automatically recommend suitable chart types based on data characteristics
- Generate common charts including bar charts, line charts, pie charts, scatter plots, and more
- Output formatted statistical summaries and analysis reports

## Typical Use Cases

1. **Sales Data Analysis**: Import CSV files exported from e-commerce platforms, analyze order totals by time period, region, and category dimensions
2. **Operations Report Consolidation**: Merge and clean data files from multiple channels to generate unified weekly or monthly reports
3. **Financial Reconciliation**: Compare data exported from different systems to quickly identify discrepancies
4. **User Behavior Analysis**: Process event tracking data, analyze user paths and conversion funnels

## Usage Examples

- "Read this CSV file, calculate total sales for each month, and generate a line chart"
- "Merge these two tables by order number and find records with inconsistent amounts"
- "Clean this data, remove duplicates, and standardize the date column to YYYY-MM-DD format"
- "Group this user data by city and calculate average spending for each city"

## Important Notes

- Recommend keeping single file processing under 100MB. Please process oversized files in batches
- When processing CSV files containing Chinese characters, prioritize using UTF-8 encoding
- When handling sensitive data, be mindful of anonymization to avoid exposing personal information during conversations
